<script setup>
import { reactive } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const state = reactive({
  isLoading: false,
  form: {
    email: "",
    password: "",
  },
  errors: {
    email: "",
    password: "",
  },
});

const toast = useToast();

const router = useRouter();

const handleSubmit = async () => {
  if (!state.form.email) {
    state.errors.email = "Please fill in a valid email address.";
  } else if (!state.form.password) {
    state.errors.password = "Please fill in a valid password.";
  }

  if (state.form.password.length < 8) {
    state.errors.password = "Password must be at least 8 characters long.";
  }

  try {
    const creds = {
      username: state.form.email,
      password: state.form.password,
    };
    const response = await axios.post(
      "http://localhost:3000/auth/login",
      creds,
      {
        withCredentials: true,
      }
    );

    console.log("Res: ", response);

    if (response.status == 201) {
      toast.success("Logged in successfully");
      // Store the access token and user information in session storage
      sessionStorage.setItem("access_token", response.data.access_token);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));

      router.push("/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  } catch (error) {
    console.log("Error logging in: ", error);
  }
};
</script>

<template>
  <h1 class="text-center font-semibold text-xl">Log in below</h1>
  <form
    @submit.prevent="handleSubmit"
    class="w-11/12 max-w-xs flex flex-col space-y-4 p-3"
  >
    <input
      :disabled="state.isLoading"
      type="email"
      v-model="state.form.email"
      placeholder="Email"
      class="p-2 border rounded-md focus:outline-none"
    />
    <p v-if="state.errors.email" class="text-red-500 text-xs">
      Please fill in a valid email address.
    </p>
    <input
      :disabled="state.isLoading"
      type="password"
      v-model="state.form.password"
      placeholder="Password"
      class="p-2 border rounded-md focus:outline-none"
    />
    <p v-if="state.errors.password" class="text-red-500 text-xs">
      {{ state.errors.password }}
    </p>
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
      {{ state.isLoading ? "Loading..." : "Login" }}
    </button>
  </form>
  <RouterLink to="/register" class="text-center text-slate-800">
    Already have an account? <span class="underline">Register</span>
  </RouterLink>
</template>
