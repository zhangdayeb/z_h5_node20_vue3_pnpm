import { getServeLanguage } from '@/lang';
import { resolveResError } from './helpers';
import { showNotify } from 'vant';
const groupPrefix = import.meta.env.VITE_GROUP_PREFIX

export function setupInterceptors(axiosInstance) {
  function reqResolve(config) {
    // 添加语言参数
    config.params = { lang: getServeLanguage(), ...config.params }

    // 默认所有请求都带token，如果没有token则为空字符串
    const accessToken = localStorage.getItem('access_token') || '';
    config.headers.Authorization = 'Bearer ' + accessToken;

    config.headers['group_prefix'] = groupPrefix;

    return config;
  }

  function reqReject(error) {
    return Promise.reject(error);
  }

  const SUCCESS_CODES = [0, 200];
  function resResolve(response) {
    const { data, status, config, statusText, headers } = response;
    if (headers['content-type']?.includes('json')) {
      if (SUCCESS_CODES.includes(data?.code)) {
        return Promise.resolve(data);
      }
      const code = data?.code ?? status;

      // 根据code处理对应的操作，并返回处理后的message
      const message = resolveResError(code, data?.message ?? statusText);

      //需要错误提醒
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      !config?.noNeedTip && message && showNotify({ message: message });
      return Promise.reject({ code, message, error: data ?? response });
    }
    return Promise.resolve(data ?? response);
  }

  async function resReject(error) {
    if (!error || !error.response) {
      const code = error?.code;
      /** 根据code处理对应的操作，并返回处理后的message */
      const message = resolveResError(code, error.message);
      window.$message?.error(message);
      return Promise.reject({ code, message, error });
    }

    const { data, status, config } = error.response;
    const code = data?.code ?? status;

    const message = resolveResError(code, data?.message ?? error.message);
    /** 需要错误提醒 */
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !config?.noNeedTip && message && showNotify({ message: message });
    return Promise.reject({
      code,
      message,
      error: error.response?.data || error.response,
    });
  }

  axiosInstance.interceptors.request.use(reqResolve, reqReject);
  axiosInstance.interceptors.response.use(resResolve, resReject);
}
