import { useState, useEffect, useCallback } from 'react';
import { Select, Spin } from 'antd';
import { vscode } from '../../utils';
import './App.css';
import 'antd/dist/antd.min.css';

export enum SortTypeEnum {
  hot = 200,
  new = 300,
}
export interface IArticleReq {
  cate_id: string | number;
  client_type: number;
  cursor: string;
  id_type: number;
  limit: number;
  sort_type: SortTypeEnum;
}
interface IArticle {
  id: string;
  title: string;
  tags: string;
  commentCount: number;
  diggCount: number;
}

const defaultQuery = {
  cate_id: '6809637767543259144',
  client_type: 6587,
  cursor: '0',
  id_type: 2,
  limit: 20,
  sort_type: 200,
};

const categoryOptions = [
  {
    label: '首页',
    value: '',
  },
  {
    label: '前端',
    value: '6809637767543259144',
  },
  {
    label: '后端',
    value: '6809637769959178254',
  },
  {
    label: '代码人生',
    value: '6809637771511070734',
  },
];

function App() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [query, setQuery] = useState<IArticleReq>(defaultQuery);
  const [loading, setLoading] = useState(false);

  const handleGetArticle = useCallback((event) => {
    const { type, data } = event.data;
    if (type === 'fetched:articles') {
      setLoading(false);
      setArticles(
        data.data.map((item: any) => {
          return {
            id: item.article_id,
            title: item.article_info.title,
            tags: item.tags
              ?.map((item: { tag_name: string }) => item.tag_name)
              .join(' · '),
            commentCount: item.article_info.comment_count,
            diggCount: item.article_info.digg_count,
          };
        })
      );
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    vscode &&
      vscode.postMessage({
        type: 'fetch:articles',
        data: JSON.stringify(query),
      });
  }, [query]);

  useEffect(() => {
    window.addEventListener('message', handleGetArticle);

    return () => {
      window.removeEventListener('message', handleGetArticle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectCategory = useCallback(
    (value: number | string) => {
      setQuery({
        ...query,
        cate_id: value,
      });
    },
    [query]
  );

  const handleChangeSortType = useCallback(
    (value: SortTypeEnum) => {
      setQuery({
        ...query,
        sort_type: value,
      });
    },
    [query]
  );

  return (
    <div className="article-module">
      <div className="article-filters">
        <div className="article-category">
          <Select
            options={categoryOptions}
            onSelect={handleSelectCategory}
            size="small"
            style={{ width: 100 }}
            value={query.cate_id || ''}
          />
        </div>
        <div className="article-sort-types">
          <span
            className={`${
              query.sort_type === SortTypeEnum.hot ? 'active-sort-type' : ''
            }`}
            onClick={() => handleChangeSortType(SortTypeEnum.hot)}
          >
            热度
          </span>
          <span
            className={`${
              query.sort_type === SortTypeEnum.new ? 'active-sort-type' : ''
            }`}
            onClick={() => handleChangeSortType(SortTypeEnum.new)}
          >
            最新
          </span>
        </div>
      </div>

      <Spin spinning={loading}>
        <div className="article-list">
          {articles.map((item) => {
            return (
              <div className="article-item" key={item.id}>
                <a href={`https://juejin.cn/post/${item.id}`}>
                  <h3 className="article-title">{item.title}</h3>
                  <div className="article-detail">
                    <div>{item.tags}</div>
                    <div>
                      赞{item.diggCount} · 评论{item.commentCount}
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </Spin>
    </div>
  );
}

export default App;
