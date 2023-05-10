<template>
  <div class="register">
    <h1>注册</h1>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      class="form"
      @submit.prevent="submitForm(ruleFormRef)"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <el-input v-model="ruleForm.captcha" class="captcha"></el-input>
        <img :src="captchaUrl" class="captcha-img" @click="refreshCaptcha" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="ruleForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="ruleForm.confirmPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getRegister } from '~/service/login'
import { IRegisterReq } from '@/interface/login'
const router = useRouter()
// import request from '@/service'

const ruleFormRef = ref<FormInstance>()
definePageMeta({
  layout: 'custom-layout'
})
const ruleForm = reactive<IRegisterReq>({
  email: '1732819972@qq.com',
  captcha: '',
  nickname: 'fish',
  password: '123456',
  confirmPassword: '123456'
})
const captchaUrl = ref(`/api/captcha?_=${Date.now()}`)

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  console.log('🚀 ~ file: index.vue:55 ~ validateConfirmPassword ~ rule:', rule)
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== ruleForm.password) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const result = await getRegister(ruleForm)
      console.log(result)
      if (result.code === 0) {
        ElMessage({
          message: '注册成功',
          type: 'success'
        })
        setTimeout(() => {
          router.push({ path: '/login' })
        }, 1500)
      }
      ruleForm.captcha = ''
      formEl.resetFields()
    } else {
      console.log('error submit!', fields)
      ElMessage({
        message: '注册失败',
        type: 'error'
      })
    }
  })
}

const refreshCaptcha = () => {
  captchaUrl.value = `/api/captcha?_=${Date.now()}`
}
</script>

<style lang="scss" scoped>
.register {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  .form {
    margin-top: 20px;
    .captcha {
      width: 60%;
      margin-right: 10px;
    }
    .captcha-img {
      width: 30%;
      height: 40px;
      cursor: pointer;
    }
  }
}
</style>
