<script setup>
import axios from "axios";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const state = reactive({
  token: null,
  loading: true,
  project: {
    name: "",
    description: "",
    userId: "",
  },
  errors: {
    name: "",
    description: "",
  },
  users: [],
});

const router = useRouter();
const route = useRoute();
const toast = useToast();

const projectId = route.params.id;

async function fetchProject() {
  try {
    const response = await axios.get(
      `http://localhost:3000/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      }
    );

    // Populate the project data with the response
    state.project = response.data;
  } catch (error) {
    toast.error("Failed to fetch project details.");
  } finally {
    state.loading = false;
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

async function handleSubmit() {
  // Validate form fields
  state.errors.name = "";
  state.errors.description = "";

  if (state.project.name.length < 4) {
    state.errors.name = "Name must be at least 4 characters long";
  }
  if (state.project.description.length < 4) {
    state.errors.description = "Description must be at least 4 characters long";
  }

  // If there are errors, return early
  if (state.errors.name || state.errors.description) {
    return;
  }

  const data = {
    name: state.project.name,
    description: state.project.description,
    userId: state.project.userId,
  };

  try {
    await axios.put(`http://localhost:3000/projects/${projectId}`, data, {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    toast.success("Project updated successfully!");
    // Redirect or show success message after update
    router.push("/dashboard");
  } catch (error) {
    console.error("Error updating project: ", error);
    toast.error("Failed to update the project.");
  }
}

// Get the access token from local storage and fetch the project details on mount
onMounted(() => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    state.token = token;
    fetchProject();
    fetchUsers();
  }
});
</script>

<template>
  <section class="p-4 max-w-lg mx-auto space-y-3">
    <h1 class="text-2xl font-bold">Edit Project</h1>
    <form @submit.prevent="handleSubmit" class="flex flex-col space-y-4">
      <input
        type="text"
        v-model="state.project.name"
        placeholder="Project name"
        class="p-2 border rounded-md focus:outline-none"
      />
      <p v-if="state.errors.name" class="text-red-500 text-xs">
        {{ state.errors.name }}
      </p>

      <input
        type="text"
        v-model="state.project.description"
        placeholder="Description"
        class="p-2 border rounded-md focus:outline-none"
      />
      <p v-if="state.errors.description" class="text-red-500 text-xs">
        {{ state.errors.description }}
      </p>

      <select
        v-model="state.project.userId"
        class="p-2 border rounded-md focus:outline-none"
      >
        <option value="" disabled>Select a user</option>
        <option v-for="user in state.users" :key="user.id" :value="user.id">
          {{ user.firstname }}
        </option>
      </select>

      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Save Changes
      </button>
    </form>
    <div v-if="state.loading" class="animate-pulse">
      <div class="h-8 bg-gray-200 rounded"></div>
      <div class="h-8 bg-gray-200 rounded"></div>
    </div>
  </section>
</template>
