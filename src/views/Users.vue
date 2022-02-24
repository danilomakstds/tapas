<template>
    <div class="text-start" id="body-pd">
    <Header />
    <SideNav />
        <br/>
        <div class="users">
            <div class="card-body mb-3">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col" style="width:40px"></th>
                    <th scope="col">Users</th>
                    <th scope="col">ID #</th>
                    <th scope="col">Email</th>
                    <th scope="col">User Group</th>
                    <th scope="col">Time In (Today)</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in userData" :key="user.id">
                    <td class="d-flex flex-row-reverse"><img :src="user.user_avatar" style="height:30px; width:30px" class="rounded-circle"/></td>
                    <td>{{user.user_firstname}} {{user.user_middlename}} {{user.user_lastname}}</td>
                    <td>{{user.user_id_number}}</td>
                    <td>{{user.user_email}}</td>
                    <td>
                      <span v-if="user.user_level == '1'" class="badge rounded-pill bg-secondary">User</span>
                      <span v-if="user.user_level == '2'" class="badge rounded-pill bg-info">HR Manager</span>
                      <span v-if="user.user_level == '3'" class="badge rounded-pill bg-primary">Super Admin</span>
                    </td>
                    <td> -- </td>
                    <td>
                      <button type="button" class="btn btn-light btn-sm me-2" id="editbutton">
                      <font-awesome-icon :icon="['fa', 'pen']" class="" /></button>
                      <button type="button" class="btn btn-light btn-sm" id="resignbutton">
                      <font-awesome-icon :icon="['fa', 'ban']" class="" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        <!-- <font-awesome-icon :icon="['fa', 'hourglass-end']" class="me-2 text-secondary" /> -->
    </div>
</template>

<script src="../components/js/users.script.js"></script>