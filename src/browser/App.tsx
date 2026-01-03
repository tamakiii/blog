import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ArticleRenderer from "./components/ArticleRenderer";
import ArticleList from "./components/ArticleList";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ArticleList />} />
        <Route path="/:locale" element={<ArticleList />} />
        <Route path="/tags" element={<ArticleList showTags />} />
        <Route path="/tags/:tag" element={<ArticleList />} />
        <Route
          path="/:locale/:year/:date/:slug"
          element={<ArticleRenderer />}
        />
      </Routes>
    </Layout>
  );
}

export default App;
