<template>
  <div class="register">
    <h1>登录</h1>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      class="form"
      @submit.prevent="submitForm(ruleFormRef)"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <el-input
          v-model="ruleForm.captcha"
          class="captcha"
          autocomplete="off"
        ></el-input>
        <img :src="captchaUrl" class="captcha-img" @click="refreshCaptcha" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="ruleForm.code" autocomplete="off"></el-input>
        <el-button :disabled="countdown > 0" @click="sendCode">{{
          countdown > 0 ? `${countdown}秒后重新发送` : '发送验证码'
        }}</el-button>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { getLogin, getSendCode } from '~/service/login'
// import { IRegisterReq } from '@/interface/login'
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
definePageMeta({
  layout: 'custom-layout'
})
const ruleForm = reactive({
  email: '1732819972@qq.com',
  captcha: '',
  password: '123456',
  code: ''
})
const captchaUrl = ref(`/api/captcha?_=${Date.now()}`)

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
  code: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const result = await getLogin(ruleForm)
      console.log(result)
      if (result.code === 0) {
        ElMessage({
          message: '登录成功',
          type: 'success'
        })
        localStorage.setItem('token', result.data.token)
        setTimeout(() => {
          router.push('/')
        }, 500)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const refreshCaptcha = () => {
  captchaUrl.value = `/api/captcha?_=${Date.now()}`
}
const countdown = ref(0)
const sendCode = async () => {
  // TODO: send email verification code
  console.log(
    '🚀 ~ file: index.vue:106 ~ sendCode ~ ruleForm.email:',
    ruleForm.email
  )
  const result = await getSendCode(ruleForm.email)
  console.log('🚀 ~ file: index.vue:110 ~ sendCode ~ result:', result)

  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
    }
  }, 1000)
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
