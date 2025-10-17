<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";

const uploadConfig = {
    cover: {
        title: "Sampul Novel",
        description: "PNG atau JPG - maksimal 2MB",
        endpoint: "novelCover",
        maxBytes: 2 * 1024 * 1024,
        sizeLabel: "2MB",
    },
    illustration: {
        title: "Ilustrasi Chapter",
        description: "PNG atau JPG - maksimal 5MB",
        endpoint: "chapterIllustration",
        maxBytes: 5 * 1024 * 1024,
        sizeLabel: "5MB",
    },
} as const;

const uploadthingUrl =
    ((import.meta as ImportMeta & { env?: Record<string, string> }).env
        ?.VITE_UPLOADTHING_URL as string | undefined) ?? "/api/uploadthing";

type UploadKind = keyof typeof uploadConfig;
type CopyStatus = "idle" | "copied" | "failed";

interface UploadState {
    isDragging: boolean;
    isUploading: boolean;
    progress: number;
    error: string;
    uploadedUrl: string;
    previewUrl: string;
    copyStatus: CopyStatus;
    objectUrl: string | null;
}

type UploadFn = (
    endpoint: string,
    opts: { files: File[]; onUploadProgress?: (progress: number) => void },
) => Promise<Array<{ url?: string }>>;

const states = reactive<Record<UploadKind, UploadState>>({
    cover: {
        isDragging: false,
        isUploading: false,
        progress: 0,
        error: "",
        uploadedUrl: "",
        previewUrl: "",
        copyStatus: "idle",
        objectUrl: null,
    },
    illustration: {
        isDragging: false,
        isUploading: false,
        progress: 0,
        error: "",
        uploadedUrl: "",
        previewUrl: "",
        copyStatus: "idle",
        objectUrl: null,
    },
});

const coverInput = ref<HTMLInputElement | null>(null);
const illustrationInput = ref<HTMLInputElement | null>(null);
const inputRefs: Record<UploadKind, typeof coverInput> = {
    cover: coverInput,
    illustration: illustrationInput,
};

const sections = computed(() =>
    (Object.keys(uploadConfig) as UploadKind[]).map((key) => ({
        key,
        inputRef: inputRefs[key],
        ...uploadConfig[key],
    })),
);

const initError = ref("");
const isReady = ref(false);

let uploadFiles: UploadFn | null = null;
const copyTimeouts: Record<UploadKind, number | undefined> = {
    cover: undefined,
    illustration: undefined,
};

onMounted(async () => {
    try {
        const mod = await import("uploadthing/client");
        const gen =
            typeof mod.genUploader === "function"
                ? mod.genUploader
                : typeof mod.default?.genUploader === "function"
                  ? mod.default.genUploader
                  : null;
        if (!gen) {
            throw new Error("genUploader tidak tersedia.");
        }

        const client = gen({ url: uploadthingUrl });
        if (typeof client === "function") {
            uploadFiles = client as UploadFn;
        } else if (client && typeof client.uploadFiles === "function") {
            uploadFiles = client.uploadFiles.bind(client) as UploadFn;
        } else {
            throw new Error("uploadFiles tidak dapat diinisialisasi.");
        }

        isReady.value = true;
    } catch (error) {
        console.error("[ImageUploader] init failed", error);
        initError.value =
            "Uploader tidak dapat dimuat. Muat ulang halaman atau coba beberapa saat lagi.";
        isReady.value = false;
    }
});

onBeforeUnmount(() => {
    (Object.keys(states) as UploadKind[]).forEach((key) => {
        const state = states[key];
        if (state.objectUrl) {
            URL.revokeObjectURL(state.objectUrl);
            state.objectUrl = null;
        }
        if (copyTimeouts[key] !== undefined) {
            window.clearTimeout(copyTimeouts[key]);
        }
    });
});

const triggerFilePicker = (kind: UploadKind) => {
    const refTarget = inputRefs[kind].value;
    if (refTarget) {
        refTarget.click();
    }
};

const onFileChange = (kind: UploadKind, event: Event) => {
    const target = event.target as HTMLInputElement | null;
    if (!target?.files) {
        return;
    }
    const files = Array.from(target.files);
    void handleUpload(kind, files);
    target.value = "";
};

const onDrop = (kind: UploadKind, event: DragEvent) => {
    states[kind].isDragging = false;
    const fileList = event.dataTransfer?.files;
    if (!fileList || fileList.length === 0) {
        return;
    }
    const files = Array.from(fileList);
    void handleUpload(kind, files);
};

const onDragEnter = (kind: UploadKind) => {
    if (!isReady.value) {
        return;
    }
    states[kind].isDragging = true;
};

const onDragLeave = (kind: UploadKind, event: DragEvent) => {
    const current = event.currentTarget as HTMLElement | null;
    if (!current) {
        return;
    }
    const related = event.relatedTarget as Node | null;
    if (!related || !current.contains(related)) {
        states[kind].isDragging = false;
    }
};

const handleUpload = async (kind: UploadKind, files: File[]) => {
    const file = files.find((item) => item.type.startsWith("image/"));
    if (!file) {
        states[kind].error = "Format file harus berupa gambar (PNG atau JPG).";
        return;
    }

    const config = uploadConfig[kind];
    if (file.size > config.maxBytes) {
        states[kind].error = `Ukuran file melebihi batas ${config.sizeLabel}.`;
        return;
    }

    if (!isReady.value || !uploadFiles) {
        states[kind].error =
            initError.value || "Uploader belum siap. Muat ulang halaman.";
        return;
    }

    const state = states[kind];
    state.error = "";
    state.uploadedUrl = "";
    state.copyStatus = "idle";
    state.progress = 0;
    state.isUploading = true;

    if (state.objectUrl) {
        URL.revokeObjectURL(state.objectUrl);
        state.objectUrl = null;
    }

    const previewUrl = URL.createObjectURL(file);
    state.previewUrl = previewUrl;
    state.objectUrl = previewUrl;

    try {
        const result = await uploadFiles(config.endpoint, {
            files: [file],
            onUploadProgress(progress) {
                state.progress = Math.round(progress);
            },
        });

        const uploadedUrl = Array.isArray(result) ? result[0]?.url : undefined;
        if (!uploadedUrl) {
            throw new Error("Upload berhasil tetapi URL tidak ditemukan.");
        }

        state.uploadedUrl = uploadedUrl;
        state.progress = 100;
    } catch (error) {
        console.error(`[ImageUploader] upload failed for ${kind}`, error);
        const message =
            error instanceof Error
                ? error.message
                : "Upload gagal. Periksa koneksi dan coba lagi.";
        state.error = message.includes(
            "Failed to parse response from UploadThing server",
        )
            ? "Server upload tidak mengembalikan data yang valid. Pastikan fungsi /api/uploadthing berjalan dan token UploadThing sudah dikonfigurasi."
            : message;
        state.previewUrl = "";
        if (state.objectUrl) {
            URL.revokeObjectURL(state.objectUrl);
            state.objectUrl = null;
        }
    } finally {
        state.isUploading = false;
    }
};

const copyUrl = async (kind: UploadKind) => {
    const state = states[kind];
    if (!state.uploadedUrl) {
        return;
    }

    try {
        await navigator.clipboard.writeText(state.uploadedUrl);
        state.copyStatus = "copied";
    } catch (error) {
        console.error("[ImageUploader] clipboard failed", error);
        state.copyStatus = "failed";
    }

    if (copyTimeouts[kind] !== undefined) {
        window.clearTimeout(copyTimeouts[kind]);
    }

    copyTimeouts[kind] = window.setTimeout(() => {
        state.copyStatus = "idle";
    }, 2000);
};
</script>

<template>
    <div class="image-uploader">
        <section class="image-uploader__intro">
            <h1 class="image-uploader__title">Image Uploader</h1>
            <p class="image-uploader__subtitle">
                Unggah sampul novel dan ilustrasi chapter ke UploadThing. Salin
                URL yang dihasilkan lalu tempel pada metadata novel.
            </p>
            <p v-if="initError" class="image-uploader__init-error">
                {{ initError }}
            </p>
        </section>

        <div class="image-uploader__grid">
            <section
                v-for="section in sections"
                :key="section.key"
                class="upload-card"
            >
                <header class="upload-card__header">
                    <h2 class="upload-card__title">{{ section.title }}</h2>
                    <p class="upload-card__description">
                        {{ section.description }}
                    </p>
                </header>

                <div
                    class="upload-zone"
                    :class="{
                        'upload-zone--dragging': states[section.key].isDragging,
                        'upload-zone--disabled': !isReady,
                    }"
                    role="button"
                    tabindex="0"
                    :aria-disabled="!isReady"
                    @click="triggerFilePicker(section.key)"
                    @keydown.enter.prevent="triggerFilePicker(section.key)"
                    @keydown.space.prevent="triggerFilePicker(section.key)"
                    @dragenter.prevent="onDragEnter(section.key)"
                    @dragover.prevent="onDragEnter(section.key)"
                    @dragleave.prevent="onDragLeave(section.key, $event)"
                    @drop.prevent="onDrop(section.key, $event)"
                >
                    <svg
                        class="upload-zone__icon"
                        viewBox="0 0 24 24"
                        focusable="false"
                        aria-hidden="true"
                    >
                        <path
                            d="M12 3.5a1 1 0 0 1 .7.3l4 4a1 1 0 0 1-1.4 1.4L13 6.9V16a1 1 0 1 1-2 0V6.9L8.7 9.2a1 1 0 1 1-1.4-1.4l4-4a1 1 0 0 1 .7-.3Z"
                        />
                        <path
                            d="M5 13a1 1 0 0 1 1 1v4h12v-4a1 1 0 1 1 2 0v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z"
                        />
                    </svg>
                    <p class="upload-zone__headline">
                        Klik untuk memilih gambar
                    </p>
                    <p class="upload-zone__hint">
                        atau tarik & lepas file ke area ini
                    </p>
                </div>

                <input
                    class="upload-card__file-input"
                    :ref="
                        (el) =>
                            (section.inputRef.value =
                                el as HTMLInputElement | null)
                    "
                    type="file"
                    accept="image/*"
                    :disabled="!isReady"
                    @change="onFileChange(section.key, $event)"
                />

                <p
                    v-if="states[section.key].isUploading"
                    class="upload-card__progress"
                >
                    Mengunggah... {{ states[section.key].progress }}%
                </p>

                <p v-if="states[section.key].error" class="upload-card__error">
                    {{ states[section.key].error }}
                </p>

                <div
                    v-if="states[section.key].uploadedUrl"
                    class="upload-card__result"
                >
                    <div
                        class="upload-card__preview"
                        v-if="states[section.key].previewUrl"
                    >
                        <img
                            :src="states[section.key].previewUrl"
                            alt="Preview gambar yang diunggah"
                            loading="lazy"
                        />
                    </div>

                    <label
                        class="upload-card__url-label"
                        :for="`${section.key}-url`"
                    >
                        URL Gambar
                    </label>
                    <div class="upload-card__url">
                        <input
                            :id="`${section.key}-url`"
                            class="upload-card__url-input"
                            type="text"
                            :value="states[section.key].uploadedUrl"
                            readonly
                        />
                        <button
                            class="upload-card__copy"
                            type="button"
                            @click="copyUrl(section.key)"
                        >
                            <span
                                v-if="
                                    states[section.key].copyStatus === 'copied'
                                "
                                >Tersalin</span
                            >
                            <span
                                v-else-if="
                                    states[section.key].copyStatus === 'failed'
                                "
                                >Gagal</span
                            >
                            <span v-else>Salin URL</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.image-uploader {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    padding: 2rem 0 3rem;
}

.image-uploader__intro {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.image-uploader__title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--vp-c-text-1);
}

.image-uploader__subtitle {
    font-size: 1rem;
    color: var(--vp-c-text-2);
    max-width: 48ch;
    margin: 0 auto;
}

.image-uploader__init-error {
    color: var(--vp-c-danger-1);
    font-weight: 600;
    margin-top: 0.5rem;
}

.image-uploader__grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.upload-card {
    background: var(--vp-c-bg-soft);
    border-radius: 16px;
    border: 1px solid var(--vp-c-divider);
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-shadow: 0 18px 40px rgba(62, 175, 124, 0.12);
}

.upload-card__header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.upload-card__title {
    font-size: 1.25rem;
    color: var(--vp-c-text-1);
    font-weight: 600;
}

.upload-card__description {
    font-size: 0.95rem;
    color: var(--vp-c-text-2);
}

.upload-zone {
    border: 2px dashed rgba(62, 175, 124, 0.4);
    border-radius: 14px;
    padding: 2.5rem 1.5rem;
    text-align: center;
    background: rgba(62, 175, 124, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition:
        border-color 0.2s ease,
        background-color 0.2s ease,
        transform 0.2s ease;
    outline: none;
}

.upload-zone:focus-visible {
    border-color: var(--kn-primary);
    box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.35);
}

.upload-zone--dragging {
    border-color: var(--kn-primary);
    background: rgba(62, 175, 124, 0.16);
    transform: translateY(-2px);
}

.upload-zone--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

.upload-zone__icon {
    width: 48px;
    height: 48px;
    fill: var(--kn-primary);
}

.upload-zone__headline {
    font-size: 1rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
}

.upload-zone__hint {
    font-size: 0.9rem;
    color: var(--vp-c-text-2);
}

.upload-card__file-input {
    display: none;
}

.upload-card__progress {
    font-weight: 600;
    color: var(--kn-primary);
}

.upload-card__error {
    color: var(--vp-c-danger-1);
    font-weight: 600;
}

.upload-card__result {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.upload-card__preview {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(62, 175, 124, 0.25);
}

.upload-card__preview img {
    width: 100%;
    display: block;
    object-fit: cover;
}

.upload-card__url-label {
    font-weight: 600;
    color: var(--vp-c-text-1);
}

.upload-card__url {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.upload-card__url-input {
    flex: 1;
    min-width: 0;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    padding: 0.65rem 0.85rem;
    font-size: 0.95rem;
    color: var(--vp-c-text-1);
}

.upload-card__copy {
    background: var(--kn-primary);
    color: var(--kn-accent-dark);
    border: none;
    border-radius: 10px;
    padding: 0.65rem 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        transform 0.2s ease;
}

.upload-card__copy:hover {
    background: var(--kn-primary-dark);
    transform: translateY(-1px);
}

.upload-card__copy:active {
    transform: translateY(1px);
}

@media (max-width: 640px) {
    .image-uploader {
        padding: 1.5rem 0 2.5rem;
    }

    .upload-card {
        padding: 1.25rem;
    }

    .upload-zone {
        padding: 2rem 1rem;
    }

    .upload-card__url {
        flex-direction: column;
    }

    .upload-card__copy {
        width: 100%;
        text-align: center;
    }
}
</style>
