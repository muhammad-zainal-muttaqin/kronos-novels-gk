import DefaultTheme from "vitepress/theme";
import "./style.css";
import NovelCard from "./components/NovelCard.vue";
import ChapterList from "./components/ChapterList.vue";
import BookmarkButton from "./components/BookmarkButton.vue";
import ImageUploader from "./components/ImageUploader.vue";
import { initBookmarkDB } from "./bookmark-db";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register global components
    app.component("NovelCard", NovelCard);
    app.component("ChapterList", ChapterList);
    app.component("BookmarkButton", BookmarkButton);
    app.component("ImageUploader", ImageUploader);

    // Initialize IndexedDB for bookmarks
    if (typeof window !== "undefined") {
      initBookmarkDB();
    }
  },
};
