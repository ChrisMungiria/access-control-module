<script setup>
import { reactive } from "vue";
const state = reactive({
  isLoading: false,
  form: {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  },
});
</script>

<template>
  <h1 class="text-center font-semibold text-xl">Create an account below</h1>
  <form
    @submit.prevent="handleSubmit"
    class="w-11/12 max-w-xs flex flex-col space-y-4 p-3"
  >
    <input
      :disabled="state.isLoading"
      type="text"
      v-model="state.form.firstname"
      placeholder="Firstname"
      class="p-2 border rounded-md focus:outline-none"
    />
    <input
      :disabled="state.isLoading"
      type="text"
      v-model="state.form.lastname"
      placeholder="Lastname"
      class="p-2 border rounded-md focus:outline-none"
    />
    <input
      :disabled="state.isLoading"
      type="email"
      v-model="state.form.email"
      placeholder="Email"
      class="p-2 border rounded-md focus:outline-none"
    />
    <input
      :disabled="state.isLoading"
      type="password"
      v-model="state.form.password"
      placeholder="Password"
      class="p-2 border rounded-md focus:outline-none"
    />
    <button
      :disabled="state.isLoading"
      :class="{
        'bg-slate-800': !state.isLoading,
        'bg-slate-500': state.isLoading,
        'text-white': true,
        'w-full': true,
        'p-3': true,
        rounded: true,
      }"
    >
      {{ state.isLoading ? "Loading..." : "Register" }}
    </button>
  </form>
  <RouterLink to="/" class="text-center text-slate-800">
    Don't have an account? <span class="underline">Log in</span>
  </RouterLink>
</template>
