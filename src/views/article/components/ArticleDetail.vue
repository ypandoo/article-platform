<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" label-position="top">

      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">发布
          </el-button>
        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
              <span v-show="postForm.title.length>=26" class='title-prompt'>可能会显示不全</span>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="作者" placement="top">
                    <el-form-item label-width="100px" label="作者:" class="postInfo-container-item" prop="author">
                      <el-input placeholder="作者" style='min-width:150px;' v-model="postForm.author" >
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="$t('table.type')" prop ="type" >
                    <el-select class="filter-item" v-model="postForm.type" clearable placeholder="请选择">
                      <el-option v-for="item in  typeOptions" :key="item._id" :label="item.title" :value="item._id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="'发布时间(文章会按照发布时间排序)'" prop ="publish_date" >
                          <el-date-picker
                          v-model="postForm.publish_date"
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="文章简介:" prop="desc">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.desc" >
          </el-input>
          <!-- <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span> -->
        </el-form-item>


        <div style="margin-bottom: 20px;">
          <el-form-item label-width="100px" label="上传文章封面图片:" prop="image">
          <UploadImage v-model="postForm.image"></UploadImage>
          </el-form-item>
        </div>

        <div style="margin-bottom: 20px;">
          <el-form-item label-width="100px" label="上传图片库:" prop="image_list">
          <UploadImages v-model="postForm.image_list"></UploadImages>
          </el-form-item>
        </div>

        <el-form-item label-width="100px" label="附件列表:" prop="file_list"> 
        <el-table :data="postForm.file_list" style="width: 100%">
          <el-table-column prop="createdAt" label="上传日期"></el-table-column>
          <el-table-column prop="title" label="附件名称" ></el-table-column>
          <el-table-column prop="desc" label="附件描述" ></el-table-column>
          <el-table-column prop="code" label="附件标识"  ></el-table-column>
          <el-table-column prop="type" label="附件类型" ></el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button @click="deleteFile(scope)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-form-item>

        <el-row style="margin: 20px 0"><el-button type="primary" @click="showAddDiag = true">上传附件</el-button></el-row>

        <div class="editor-container">
          <el-form-item label-width="100px" label="文章正文:" prop="content">
          <tinymce :height="500" ref="editor" v-model="postForm.content"></tinymce>
          </el-form-item>
        </div>
      </div>
    </el-form>


    <el-dialog title="上传附件" :visible.sync="showAddDiag" width="80%">
      <el-form :model="fileForm" :label-position="'top'" :rules="fileRules" ref="fileForm">

        <el-row>
          <el-col :span="8" >
            <el-form-item label="附件名称"  :label-position="'top'" prop="title" >
              <el-input v-model="fileForm.title" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="7" :offset="1">
            <el-form-item label="附件类型" :label-position="'top'" prop="type">
              <el-select v-model="fileForm.type" placeholder="请选择附件类型">
                <el-option label="音频文件(mp3,aac等)" value="audio"></el-option>
                <el-option label="视频文件(mp4,mkv等)" value="vedio"></el-option>
                <el-option label="图片文件(jpeg,png等)" value="image"></el-option>
                <el-option label="办公文件(word,excel,ppt等)" value="office"></el-option>
                <el-option label="其他文件(压缩包等)" value="other"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="附件代码（给附件赋予不同的作用）" prop="code">
              <el-input v-model="fileForm.code" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="附件描述（附件的说明文字）" prop="desc">
          <el-input v-model="fileForm.desc" autocomplete="off"></el-input>
        </el-form-item>

        <div style="margin-bottom: 20px;">
          <el-form-item label-width="100px" label="选择您需要上传的附件:" prop="url">
          <Upload v-model="fileForm.url"></Upload>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddDiag = false">取 消</el-button>
        <el-button type="primary" @click="uploadFile">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleFile'
import UploadImage from '@/components/Upload/singleImage3'
import UploadImages from '@/components/Upload/multiImages'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchArticle, createArticle, updateArticle } from '@/api/article'
import { addFile } from '@/api/file'
import { fetchList as fetchCategory} from '@/api/category'
import { userSearch } from '@/api/remoteSearch'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  desc: '', // 文章摘要
  image: '', // 文章图片
  type: '',
  author: '',
  image_list: [],
  file_list:[],
  publish_date: new Date(), // 前台展示时间
}

const defaultFileForm = {
  title: '', 
  desc: '', 
  code: '', 
  url: '', 
  type: 'image',
}

export default {
  name: 'articleDetail',
  components: { Tinymce, MDinput, Upload, UploadImage, Multiselect, Sticky, UploadImages },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: '内容未填写完整',
          type: 'error'
        })
        //callback(null)
      } else {
        callback()
      }
    }

    return {
      postForm: Object.assign({}, defaultForm),
      fileForm: Object.assign({}, defaultFileForm),
      
      fetchSuccess: true,
      loading: false,
      showAddDiag: false,

      typeOptions:[],

      rules: {
        title: [{ required: true, validator: validateRequire }],
        author: [{ required: true, validator: validateRequire }],
        type: [{ required: true, validator: validateRequire }],
        content: [{ required: true, validator: validateRequire }],
        desc: [{ required: true, validator: validateRequire }], 
        publish_date: [{ required: true, validator: validateRequire }]
      },

      fileRules: {
        title: [{ required: true, validator: validateRequire }],
        type: [{ required: true, validator: validateRequire }],
        code: [{ required: true, validator: validateRequire }],
        url: [{ required: true, validator: validateRequire }], 
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    }
  },
  created() {
      this.postForm = Object.assign({}, defaultForm)
      this.fileForm =Object.assign({}, defaultFileForm)
      fetchCategory({limit:100, page:0}).then(response => {
        this.typeOptions = response.data.items;
        if (this.isEdit) {
          this.fetchData()
        } 
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
  },

  methods: {
    fetchData() {
        fetchArticle({ id: this.$route.params.id }).then(response => {
          this.postForm = response.data.item
          //this.postForm.title = response.data.item.title
          // this.postForm.image_uri = response.data.item.url
          // this.postForm.content_short = response.data.item.desc
          // this.postForm.content = response.data.item.content
          // this.postForm.author = response.data.item.author
          // this.postForm.type = response.data.item.type
          // this.postForm.publish_date = response.data.item.publish_date
          // this.postForm.cover_url = response.data.item.cover_url

          // this.postForm.image_list = response.data.item.image_list
          // this.postForm.file_list = response.data.item.file_list

        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    },

    submitForm() {
      // this.postForm.display_time = parseInt(this.display_time / 1000)
      console.log(this.postForm)
      var self = this
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            const submitData = {
              'title': self.postForm.title,
              'desc': self.postForm.desc,
              'id': this.$route.params.id,
              'content' : self.postForm.content,
              'author': self.postForm.author,
              'type': self.postForm.type,
              'publish_date':self.postForm.publish_date,
              'image': self.postForm.image,
              "image_list" : self.postForm.image_list,
              "file_list" : self.postForm.file_list
            }

            // add new article
            updateArticle(submitData).then(response => {
              if (response.data.error_code === 0) {
                this.$notify({
                  title: '成功',
                  message: '文章修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.postForm.status = 'published'
                this.$router.push({path: '/article/list'})
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                })
              }
              this.loading = false
            }).catch(err => {
              this.$message({
                message: '文章修改失败',
                type: 'warning'
              })
              this.loading = false
              console.log(err)
            })
          } else {
            const submitData = {
              'title': self.postForm.title,
              'desc': self.postForm.desc,
              'image': self.postForm.image,
              'content' : self.postForm.content,
              'author': self.postForm.author,
              'type': self.postForm.type,
              'publish_date': self.postForm.publish_date,
              'file_list': self.postForm.file_list,
              "image_list" : self.postForm.image_list
            }

            // add new article
            createArticle(submitData).then(response => {
              if (response.data.error_code === 0) {
                this.$notify({
                  title: '成功',
                  message: '文章创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.postForm.status = 'published'
                 this.$router.push({path: '/article/list'})
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                })
              }
              this.loading = false
            }).catch(err => {
              this.$message({
                message: '文章创建失败',
                type: 'warning'
              })
              this.loading = false
              console.log(err)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    uploadFile() {
      console.log(this.fileForm)
      var self = this
      this.$refs.fileForm.validate(valid => {
        if (valid) {
          addFile(self.fileForm).then(response => {
          if (response.data.error_code === 0) {
            this.$notify({title: '成功',message: '文件上传成功',type: 'success',duration: 2000})
            this.showAddDiag = false
            this.postForm.file_list.push(response.data.doc)
            this.fileForm =Object.assign({}, defaultFileForm)
          } else {
            this.$message({message: response.data.msg,type: 'warning'})
          }
          this.loading = false
          }).catch(err => {
            this.$message({message: '文件上传失败',type: 'warning'})
            this.loading = false
            console.log(err)
          })
        }
      })
    },

    deleteFile(row){
      console.log(row)
      this.postForm.file_list.splice(row.$index, 1)
    },

    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },

    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        console.log(response)
        this.userLIstOptions = response.data.items.map(v => ({
          key: v.name
        }))
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }

  label{
    text-align: left !important;
  }
</style>

