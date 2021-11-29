import { useState, useEffect, useCallback } from 'react';
import { Select, Spin } from 'antd';
import { vscode } from '../../utils';
import './App.css';
import 'antd/dist/antd.dark.min.css';

interface IGithub {
  id: number;
  url: string;
  username: string;
  reponame: string;
  description: string;
  lang: GithubLangEnum;
  starCount: number;
  forkCount: number;
  langColor: string;
}

export enum GithubCategoryEnum {
  trending = 'trending',
  upcome = 'upcome',
}

export enum GithubPeriodEnum {
  day = 'day',
  week = 'week',
  month = 'month',
}

export enum GithubLangEnum {
  javascript = 'javascript',
  rust = 'rust',
  typescript = 'typescript',
  vue = 'vue',
  css = 'css',
  html = 'html',
}

export interface IGithubReq {
  category: GithubCategoryEnum;
  lang: GithubLangEnum;
  limit: number;
  offset: number;
  period: GithubPeriodEnum;
}

const defaultQuery = {
  category: GithubCategoryEnum.trending,
  lang: GithubLangEnum.javascript,
  limit: 30,
  offset: 0,
  period: GithubPeriodEnum.day,
};

function App() {
  const [githubs, setGithubs] = useState<IGithub[]>([]);
  const [query, setQuery] = useState<IGithubReq>(defaultQuery);
  const [loading, setLoading] = useState(false);

  const handleGetGithubs = useCallback((event) => {
    const { type, data } = event.data;
    setLoading(false);
    if (type === 'fetched:githubs') {
      console.log('handleGetGithubs', event);
      setGithubs(data);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    vscode &&
      vscode.postMessage({
        type: 'fetch:githubs',
        data: JSON.stringify(query),
      });
  }, [query]);

  useEffect(() => {
    window.addEventListener('message', handleGetGithubs);

    return () => {
      window.removeEventListener('message', handleGetGithubs);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectCategory = useCallback(
    (category: GithubCategoryEnum) => {
      setQuery({
        ...query,
        category,
      });
    },
    [query]
  );

  const handleSelectPeriod = useCallback(
    (period: GithubPeriodEnum) => {
      setQuery({
        ...query,
        period,
      });
    },
    [query]
  );

  const handleSelectLang = useCallback(
    (lang: GithubLangEnum) => {
      setQuery({
        ...query,
        lang,
      });
    },
    [query]
  );

  return (
    <div className="github-module">
      <div className="github-filters">
        <div className="github-filters-title">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABmCAMAAAAOARRQAAAA4VBMVEUbFRUaFxcwMDAaFRX///8iHh79/f0dGBhUUFDT0tK4t7cwKyuysbHNy8syLS34+PhoZWUrJiYfGhrw8PDu7e3Z2Nivrq6npaVxbm5jYGDe3d3DwsKamJh7eHhtampXU1NCPj76+vr39vbg39/b29vR0NDBv7+Cf39aVlZNSUklICDy8vLq6enk5OTi4eHa2dnHxsa1s7NfW1s0Ly/o6OjV1NS8u7utq6ukoqKem5uSj491cnJdWVlXVFRRTU1IREQ+OTk4NDQuKionIiL09PS2tLSVkpKPjY2Kh4eHhISpp6evBPJsAAAAA3RSTlPmhwVTsZLPAAADoklEQVRo3u3aaVMaMRzHcWx+e7EHN+U+CoigghTv+6hV+/5fUOsITeIsm38WatuZ/T5TGT4SkrAEUp+2UuwPl9r6lNpiH9BWKsU+IJqyfgmTMCyshEmYv8t0WuczZ1LMZIoT5/G80mFs48y4Ut7Du4pe5WGjzE75C0LLeJcbY7IOIiq1rE0w7SkU1S7XZlwPhNLz9ZhqAaS+Zddg8g2QOzXiMuM6NPJz8RjXgVb9eRzGrUGz/bk+M3agXT+ny+TriJFvaDINxOqzHlPl/+Cw4ZuIyBw0hgdY1tJhXL4qv77++HKIFe09B4wxm6/TOw3G41vw22gbQw5nMli2+/L2Z2sXy47pTBu/G7BF9ydmzxtedQLjFxp02sNyzZwFbBEfNVTJzFTYFPlv5Vkk/+IEv5tYRCYLXpmROgWvQmQcaYaSOgOvZpGYHQjVaUwaQlUSU4bQIY3pQ+iYwozlq4tbihJArHtPYCoQ244xaGgSGHnMcjTmoSeNGoGRrvouGLEshHYtJdOBUM9i1I4gNFIyLQg9M3JN6clRMucQuqEztxA6UzIz8ApMo8PV8zMVvdOUdBgfvJ6SmSh2GtLSKSqZInhpHeYEvK6SychDTO8RQnkVI+5ovg6zDSFLxeyDt6/DTKUpqmIG4Jl5MiIPQ03FyI/dpis3EPKVzAmEvtOZZwillUwDQg6dOYDQqZLJQuyOqrhd6fVDybgQ86jMZ/mVXcmwGsRGNKVjShfWTM2cQmxgUBTjQB4DAtOC1DZh7VhpaF9y5L5AKj1WPpYypMyAwLDPkNu/ilbsHuRmTMnw9Vw49peT9NGOQDwT77JJDPOXF/b3Z1hUerLzIaPVPi+FHElpvfEovL4drPKXn8yRJ83uUXraRVgXRMYq8R0tC55vSbeqI7SeQWTY9WK4X+QJcROxJHmXjMbw+zZtxoz+yn10gJA8RmdyRf5sBst7a7B3PYUou64Gw1rCqYDRPDJhlr7Pw28k14x1mHKwmLm5sC1nh3yYory6izpcvMb76pYuYzhvhyPXGkz/Icax3dul1Jfh6n0Gcnt3cQ4hA2dxNfQ0mueN251AwUzvYh6ppiH2NZqpP8Q9ILbOIpm2NMesNY67K8WIw4srYVU21zu8z/3gzOp147lrfxRhLze17Cpmov4oglC+4kQN2tGFwZQMrVG5i4IbssGaM5tt8kMvt30f8sS1X9fSf/pJYcIkTMIkTMJsivlXvqCW+qAv9X3QVxR/AveXsgHzlAQ9AAAAAElFTkSuQmCC"
            alt=""
          />
          github
        </div>
        <div className="github-category">
          <Select
            onSelect={handleSelectCategory}
            size="small"
            style={{ width: 100, marginRight: 8 }}
            value={query.category}
          >
            <Select.Option value={GithubCategoryEnum.trending}>
              热门
            </Select.Option>
            <Select.Option value={GithubCategoryEnum.upcome}>
              新生
            </Select.Option>
          </Select>
          <Select
            onSelect={handleSelectPeriod}
            size="small"
            style={{ width: 100, marginRight: 8 }}
            value={query.period}
          >
            <Select.Option value={GithubPeriodEnum.day}>今日</Select.Option>
            <Select.Option value={GithubPeriodEnum.week}>本周</Select.Option>
            <Select.Option value={GithubPeriodEnum.month}>本月</Select.Option>
          </Select>
          <Select
            onSelect={handleSelectLang}
            size="small"
            style={{ width: 100, marginRight: 8 }}
            value={query.lang}
          >
            <Select.Option value={GithubLangEnum.javascript}>
              JavaScript
            </Select.Option>
            <Select.Option value={GithubLangEnum.rust}>Rust</Select.Option>
            <Select.Option value={GithubLangEnum.typescript}>
              TypeScript
            </Select.Option>
            <Select.Option value={GithubLangEnum.vue}>Vue</Select.Option>
            <Select.Option value={GithubLangEnum.html}>HTML</Select.Option>
            <Select.Option value={GithubLangEnum.css}>CSS</Select.Option>
          </Select>
        </div>
      </div>

      <Spin spinning={loading}>
        <div className="github-list">
          {githubs.map((item) => {
            return (
              <div className="github-item" key={item.id}>
                <a
                  className="github-title"
                  href={`https://github.com/${item.username}/${item.reponame}`}
                >
                  {`${item.username}/${item.reponame}`}
                  <div className="github-detail">
                    <div className="github-desc">{item.description}</div>
                    <div className="github-detail-info">
                      <span className="github-star">
                        <i className="github-icon github-start-icon">
                          &#11089;
                        </i>
                        <span>{item.starCount}</span>
                      </span>
                      <span className="github-lang">
                        <i
                          className="github-icon cycle-icon"
                          style={{ backgroundColor: item.langColor }}
                        ></i>
                        <span>{item.lang}</span>
                      </span>
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
