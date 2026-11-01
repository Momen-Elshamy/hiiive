import styles from "./ArticleBodyBlock.module.css";
import { LazyRichTextField } from "../../puck/fields/LazyRichTextField.jsx";

export default function ArticleBody({ body }) {
   return (
      <section className={styles.articleBodyRoot}>
         <div
            className={styles.articleBodyContent}
            dangerouslySetInnerHTML={{ __html: body || "" }}
         />
      </section>
   );
}

export const ArticleBodyBlock = {
   label: "Article Body",
   fields: {
      body: {
         type: "custom",
         render: LazyRichTextField,
      },
   },
   defaultProps: {
      body: "<p>Start writing your article content here. This block supports rich text.</p>",
   },
   resolvePermissions: (data) => {
      if (data.props._templateLocked) return { delete: false, drag: false };
      return {};
   },
   render: ({ body }) => <ArticleBody body={body} />,
};
