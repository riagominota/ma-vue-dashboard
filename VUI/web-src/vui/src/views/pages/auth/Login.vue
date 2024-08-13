<script lang="ts" setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
// import AppConfig from '@/layout/AppConfig.vue';
import {useUserStore} from '@/stores/UserStore'
const { layoutConfig } = useLayout();
const email = ref('');
const password = ref('');
const checked = ref(false);

const userStore = useUserStore();

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});


</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                        <span class="text-600 font-medium" v-tr="'login.pleaseSignIn'"></span>
                        <!-- <span class="text-600 font-medium" ma-tr="login.pleaseSignIn">Sign in to continue</span> -->
                        
                    </div>

                    <div>
                        <label for="username1"  v-tr="'login.userId'" class="block text-900 text-xl font-medium mb-2"></label>
                        <InputText id="username1" type="text" v-tr="'login.userId'"  class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="username" />

                        <label for="password1" v-tr="'login.password'" class="block text-900 font-medium text-xl mb-2"></label>
                        <Password id="password1" v-model="password" v-tr="'login.password'" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button v-tr="'login.loginButton'"  v-on:click="userStore.login({username,password})" class="w-full p-3 text-xl"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
