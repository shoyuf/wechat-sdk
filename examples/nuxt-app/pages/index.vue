<template>
  <div>
    <h3>Works!</h3>
    <ul>
      <li v-for="m in message" :key="m">
        <p>{{ m }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    msg: String
  },
  data() {
    return {
      message: []
    }
  },
  created() {
    this.initWechat()
  },
  methods: {
    async initWechat() {
      try {
        this.message = ['加载JSSDK脚本...']
        await this.$wechat.require()
        this.message.push('JSSDK脚本加载成功！，v' + this.$wechat.version)

        this.message.push('注册JSSDK...')
        await this.$wechat.config({ debug: true })
        this.message.push('JSSDK注册成功！')

        this.message.push('配置微信分享信息')
        await this.$wechat.setupShareData({ title: 'Nuxt-Wechat-Module' })
      } catch (error) {
        console.error(error)
        this.message.push(`ERROR#${error.code}: ${error.message}`)
      }
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
  width: calc(100% - 20px);
}
p {
  font-size: 1em;
  width: 100%;
}
a {
  color: #55b881;
}
</style>
