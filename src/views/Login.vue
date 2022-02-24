<template>
  <div class="p-4 position-relative">
    <img src="../assets/images/maks.png" style="height:150px" />
    <h1 class="aldus mb-0">M A K S</h1>
    <span class="aldus" style="font-size: 16px">DATATECH SERVICES</span>
    <div class="login bg-white mt-5">
      
      <!-- show alert message here -->
      <div class="alert fade show mb-4 text-start" role="alert" :class="messageType" v-if="message" v-html="message"></div>

      <form class="text-start" @submit="userLogin">
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" v-model="user_email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" v-model="user_password" class="form-control" id="exampleInputPassword1">
        </div>
        <button type="submit" class="btn btn-primary" id="liveToastBtn">Submit</button>
      </form>
    </div>
   
  </div>
  
</template>

<script src="../components/js/login.script.js"></script>