<script setup>
import axios from "axios";
import { onMounted, reactive } from "vue";
import { useToast } from "vue-toastification";

const state = reactive({
  isLoading: false,
  token: null,
  form: {
    name: "",
    description: "",
    userId: "",
  },
  errors: {
    name: "",
    description: "",
    userId: "",
  },
  users: [],
});

const toast = useToast();

async function handleSubmit() {
  state.errors.name = "";
  state.errors.description = "";
  state.errors.userId = "";

  if (state.form.name.length < 4) {
    state.errors.name = "Name must be at least 4 characters long";
  }
  if (state.form.description.length < 4) {
    state.errors.description = "Description must be at least 4 characters long";
  }
  if (!state.form.userId) {
    state.errors.userId = "Please select a user";
  }

  if (state.errors.name || state.errors.description || state.errors.userId) {
    return;
  }

  state.isLoading = true;

  try {
    const data = {
      name: state.form.name,
      description: state.form.description,
      userId: state.form.userId,
    };
    const response = await axios.post("http://localhost:3000/projects", data, {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });

    if (response.status === 201) {
      toast.success("Project created successfully");
    }

    state.form.name = "";
    state.form.description = "";
    state.form.userId = "";
  } catch (error) {
    console.log("Error creating a project: ", error);
  } finally {
    state.isLoading = false;
  }
}

async function fetchUsers() {
  state.isLoading = true;
  try {
    const response = await axios.get("http://localhost:3000/users/notadmin", {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });

    state.users = response.data;
  } catch (error) {
    console.log("Error fetching users: ", error);
  } finally {
    state.isLoading = false;
  }
}

onMounted(() => {
  state.token = sessionStorage.getItem("access_token");
  if (state.token) {
    fetchUsers();
  }
});
</script>

<template>
  <h1 class="text-center font-semibold text-xl">Add a project below</h1>
  <form
    @submit.prevent="handleSubmit"
    class="w-11/12 max-w-xs flex flex-col space-y-4 p-3"
  >
    <input
      :disabled="state.isLoading"
      type="text"
      v-model="state.form.name"
      placeholder="Project name"
      class="p-2 border rounded-md focus:outline-none"
    />
    <p v-if="state.errors.name" class="text-red-500 text-xs">
      {{ state.errors.name }}
    </p>

    <input
      :disabled="state.isLoading"
      type="text"
      v-model="state.form.description"
      placeholder="Description"
      class="p-2 border rounded-md focus:outline-none"
    />
    <p v-if="state.errors.description" class="text-red-500 text-xs">
      {{ state.errors.description }}
    </p>

    <select
      v-model="state.form.userId"
      :disabled="state.isLoading"
      class="p-2 border rounded-md focus:outline-none"
    >
      <option value="" disabled>Select a user</option>
      <option v-for="user in state.users" :key="user.id" :value="user.id">
        {{ user.firstname }}
      </option>
    </select>
    <p v-if="state.errors.userId" class="text-red-500 text-xs">
      {{ state.errors.userId }}
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
      {{ state.isLoading ? "Loading..." : "Submit" }}
    </button>
    <RouterLink class="underline text-slate-800" to="/dashboard">
      Back home
    </RouterLink>
  </form>
</template>
