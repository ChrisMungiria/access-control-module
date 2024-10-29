<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { onMounted, reactive } from "vue";
import { useToast } from "vue-toastification";

const router = useRouter();

const toast = useToast();

const state = reactive({
  token: null,
  loading: true,
  user: null,
  profile: null,
  loadingProjects: true,
  projects: [],
  allUsers: [],
});

async function getProfile() {
  const token = sessionStorage.getItem("access_token");

  try {
    const response = await axios.get("http://localhost:3000/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    state.profile = response.data;
  } catch (error) {
    console.error("Profile fetch error:", error);
  }
}

async function fetchProjects() {
  try {
    const response = await axios.get("http://localhost:3000/projects", {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    state.projects = response.data;
  } catch (error) {
    console.log("Error fetching projects: ", error);
  } finally {
    state.loadingProjects = false;
  }
}

async function deleteProject(id) {
  console.log("Deleting project: ", id);
  try {
    const response = await axios.delete(
      `http://localhost:3000/projects/${id}`,
      {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      }
    );

    toast.success("Deleted project successfully");
    // refresh projects
    fetchProjects();
  } catch (error) {
    console.log("Error delering project: ", error);
  }
}

function logout() {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("user");
  router.push("/");
}

async function fetchAllUsers() {
  try {
    const response = await axios.get("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    state.allUsers = response.data;
  } catch (error) {
    console.log("Error fetching users: ", error);
  }
}

onMounted(() => {
  state.user = JSON.parse(sessionStorage.getItem("user"));
  if (!state.user) {
    router.push("/");
  }

  state.token = sessionStorage.getItem("access_token");
  if (state.token) {
    fetchProjects();
    fetchAllUsers();
  }
});
</script>

<template>
  <section class="p-4 max-w-lg mx-auto space-y-3">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <div class="flex items-center justify-between">
      <h3>Hi there {{ state.user ? state.user.firstname : "" }}</h3>
      <button
        @click="logout"
        class="px-4 p-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
      >
        Logout
      </button>
    </div>
    <RouterLink
      v-if="state.user && state.user.roleId === 1"
      to="/project/addproject"
      class="px-4 p-2 rounded-md bg-slate-800 text-white"
    >
      Add a project
    </RouterLink>
    <div v-if="state.loadingProjects" class="w-full space-y-2">
      <div class="w-full h-10 bg-slate-100 animate-pulse"></div>
      <div class="w-full h-10 bg-slate-100 animate-pulse"></div>
      <div class="w-full h-10 bg-slate-100 animate-pulse"></div>
      <div class="w-full h-10 bg-slate-100 animate-pulse"></div>
    </div>
    <div v-else>
      <h1
        v-if="state.user && state.user.roleId === 1"
        class="text-xl font-semibold"
      >
        All projects
      </h1>
      <h1 v-else class="text-xl font-semibold">Your projects</h1>
      <div
        v-if="state.projects.length === 0"
        class="w-full p-4 flex items-center justify-center"
      >
        <p class="text-slate-500">You have no projects</p>
      </div>
      <div v-for="project in state.projects" class="space-y-3">
        <div :key="project.id" class="w-full border p-2 my-2">
          <h1 class="font-semibold text-lg">{{ project.name }}</h1>
          <h2 class="">{{ project.description }}</h2>
          <h3
            v-if="state.user && state.user.roleId === 1"
            class="text-xs font-light text-slate-500"
          >
            Assigned to: {{ project.user.firstname }}
            {{ project.user.lastname }}
          </h3>
          <div
            v-if="
              (state.user && state.user.roleId === 1) || state.user.roleId === 2
            "
            class="flex items-center justify-between mt-2"
          >
            <RouterLink
              :to="`/project/editproject/${project.id}`"
              class="text-xs p-2 rounded-md border border-blue-500 text-blue-500"
              >Edit project
            </RouterLink>
            <button
              v-if="state.user && state.user.roleId === 1"
              @click="deleteProject(project.id)"
              class="text-xs p-2 rounded-md bg-red-500 text-white"
            >
              Delete project
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="
          (state.user && state.user.roleId === 1) || state.user.roleId === 2
        "
      >
        <h1 class="text-xl font-semibold">All users</h1>
        <ul v-for="user in state.allUsers" class="ml-4">
          <li :key="user.id" class="list-disc">
            {{ user.firstname }} {{ user.lastname }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
