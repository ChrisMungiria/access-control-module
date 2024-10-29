import { createRouter, createWebHistory } from "vue-router";

// Views
import Dashboard from "@/views/Dashboard.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import AddProjectView from "@/views/projects/AddProjectView.vue";
import EditProjectView from "@/views/projects/EditProjectView.vue";

// Function to check authentication
function isAuthenticated() {
  return sessionStorage.getItem("access_token") !== null;
}

// function to check if user is admin
function isAdmin() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user.roleId == 1) {
    return true;
  }
  return false;
}

function isManager() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user.roleId == 2) {
    return true;
  }
  return false;
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "login", component: LoginView },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) {
          next();
        } else {
          next({ name: "login" });
        }
      },
    },
    {
      path: "/project/addproject",
      name: "add-task",
      component: AddProjectView,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated() && isAdmin()) {
          next();
        } else {
          next({ name: "dashboard" });
        }
      },
    },
    {
      path: "/project/editproject/:id",
      name: "edit-task",
      component: EditProjectView,
      beforeEnter: (to, from, next) => {
        if ((isAuthenticated() && isAdmin()) || isManager()) {
          next();
        } else {
          next({ name: "dashboard" });
        }
      },
    },
  ],
});

export default router;
