import { Layout } from "@/components/layout/Layout";
import { TestLink } from "./multi";

// for template
const pageName = "test/upload";
const pageNum = 0;

export const App = () => {
  return (
    <Layout pageName={pageName} isSignin={false}>
      <TestLink thisPageNum={pageNum} />
      <div className="my-2"></div>
    </Layout>
  );
};

export default App;
