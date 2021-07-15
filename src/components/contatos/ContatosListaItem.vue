<template>
  <li>
    <span>{{ contato.nome }}</span>
    <router-link 
      :to="{ path: `/contatos/${contato.id}` }"
      class="btn btn-info btn-sm float-right">
      Detalhes
    </router-link>
    <!-- <button 
      class="btn btn-info btn-sm float-right"
      @click="verDetalhes">
        Detalhes
    </button> -->
  </li>
</template>

<script>
export default {
  props: {
    contato: {
      type: Object,
      required: true
    }
  },
  methods: {
    verDetalhes() {
      // this.$router.push(`/contatos/${this.contato.id}`)
      // this.$router.push({ path: `/contatos/${this.contato.id}` })
      // this.$router.push({ path: '/contatos', params: {id: this.contato.id} }) // Não funciona pois não é nomeada e precisa de parâmetros
      // this.$router.push({ name: 'contatos', params: { id: this.contato.id} })
      this.$router.replace({ name: 'contatos', params: { id: this.contato.id} }) 
    }
  },
}
</script>