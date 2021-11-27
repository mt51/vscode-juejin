import * as vscode from 'vscode';
import axios from 'axios';

export enum SortTypeEnum {
  hot = 200,
  new = 300
}

export interface IArticleReq {
  cate_id: string;
  client_type: number;
  cursor: string;
  id_type: number;
  limit: number;
  sort_type: SortTypeEnum;
}

export function getArticles(params: IArticleReq) {
  return axios.post('https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed?uuid=7032205944063542798&aid=6587', params).then(({ data }) => {
    return data;
  }).catch((e) => {
    vscode.window.showInformationMessage('获取数据失败');
  });
}



export enum GithubCategoryEnum {
  trending = 'trending',
  upcome = 'upcome'
}

export enum GithubPeriodEnum {
  day = 'day',
  week = 'week',
  month = 'month'
}

export enum GithubLangEnum {
  javascript = 'javascript',
  rust = 'rust',
  typescript = 'typescript',
  vue = 'vue',
  css = 'css',
  html = 'html'
}

export interface IGithubReq {
  category: GithubCategoryEnum;
  lang: GithubLangEnum;
  limit: number;
  offset: number;
  period: GithubPeriodEnum;
}

export function getGithub(params: IGithubReq) {
  return axios.post('https://e.juejin.cn/resources/github', params).then(({ data }) => data).catch((e) => {
    vscode.window.showInformationMessage('获取数据失败');
  });
}
