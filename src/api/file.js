import request from '@/utils/request'

export function addFile(data) {
  return request({
    url: '/file/add',
    method: 'post',
    data
  })
}