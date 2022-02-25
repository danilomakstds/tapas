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
                      <button type="button" class="btn btn-light btn-sm me-2" id="editbutton" @click="showEditModal(user)">
                      <font-awesome-icon :icon="['fa', 'pen']" class="" /></button>
                      <button type="button" class="btn btn-light btn-sm" id="resignbutton">
                      <font-awesome-icon :icon="['fa', 'ban']" class="" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Scrollable modal -->
              <form @submit="updateUser">
                <div class="modal fade" id="editUserModal">
                  <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalToggleLabel2">Edit | <strong>{{selectedUser.user_firstname}}</strong></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body" style="font-size:12px">
                        
                          <table class="w-100">
                            <tr>
                              <td colspan="4">
                                <div>
                                  <label class="form-label"><strong>Personal Info</strong></label>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td><input class="form-control form-control-sm" type="text" placeholder="First Name" v-model="selectedUser.user_firstname" name="firstname"></td>
                              <td><input class="form-control form-control-sm" type="text" placeholder="Middle Name" v-model="selectedUser.user_middlename" name="middlename"></td>
                              <td><input class="form-control form-control-sm" type="text" placeholder="Last Name" v-model="selectedUser.user_lastname" name="lastname"></td>
                              <td style="width:60px"><input class="form-control form-control-sm" type="text" placeholder="Suffix" v-model="selectedUser.user_suffix" name="suffix"></td>
                            </tr>
                            <tr>
                              <td><input class="form-control form-control-sm" type="text" placeholder="Contact Number" v-model="selectedUser.user_contact_number" name="contact_number"></td>
                            </tr>
                            <tr>
                              <td colspan="4">
                                <div class="mt-3">
                                  <label class="form-label">User Avatar URL</label>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="4">
                                <input class="form-control form-control-sm" type="text" placeholder="Avatar" v-model="selectedUser.user_avatar" name="avatar">
                              </td>
                            </tr>
                            <tr>
                              <td colspan="4">
                                <div class="mt-3">
                                  <label class="form-label">Birth Date</label>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="1">
                                <input class="form-control form-control-sm" type="date" placeholder="Birthday" v-model="selectedUser.user_birthday" name="birthday">
                              </td>
                            </tr>
                            <tr>
                              <td colspan="4">
                                <div class="mb-3 mt-3">
                                  <label for="exampleFormControlTextarea1" class="form-label">Current Address</label>
                                  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="selectedUser.user_current_address" name="address"></textarea>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="4">
                                <div>
                                  <label class="form-label"><strong>Company Info</strong></label>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="w-100">
                            <tr>
                              <td><input class="form-control form-control-sm" type="text" placeholder="maksdts email" v-model="selectedUser.user_email" name="email"></td>
                              <td><input class="form-control form-control-sm" type="text" placeholder="Company ID#" v-model="selectedUser.user_id_number" name="id_number"></td>
                              <td><input class="form-control form-control-sm" type="text" placeholder="Salary (monthly)" v-model="selectedUser.user_salary" default="0" name="salary"></td>
                            </tr>
                            <tr>
                              <td>
                                <select class="form-select form-select-sm" aria-label=".form-select-sm example" v-model="selectedUser.user_level" name="level">
                                  <option value="1">Select user type</option>
                                  <option value="1">User</option>
                                  <option value="2">HR Manager</option>
                                  <option value="3">Super Admin</option>
                                </select>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="1">
                                <div class="mt-3">
                                  <label class="form-label">Time in schedule (24hour)</label>
                                </div>
                              </td>
                              <td colspan="1">
                                <div class="mt-3">
                                  <label class="form-label">Time out schedule (24hour)</label>
                                </div>
                              </td>
                              <td colspan="2">
                                <div class="mt-3">
                                  <label class="form-label">Date hired</label>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="1">
                                <input class="form-control form-control-sm" type="text" placeholder="Time in" v-model="selectedUser.user_schedule_in" name="schedule_in">
                              </td>
                              <td colspan="1">
                                <input class="form-control form-control-sm" type="text" placeholder="Time out" v-model="selectedUser.user_schedule_out" name="schedule_out">
                              </td>
                              <td colspan="1">
                                <input class="form-control form-control-sm" type="date" placeholder="Date hired" v-model="selectedUser.user_datehired" name="datehired">
                              </td>
                            </tr>
                          </table>
                          <br/> <br/>
                          <span><strong>Contribution Info</strong></span>
                          <table class="w-100">
                            <tr>
                              <td>
                                <div>
                                  <label class="form-label">SSS #</label>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <label class="form-label">Pag-ibig #</label>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input class="form-control form-control-sm" type="text" placeholder="SSS" v-model="selectedUser.user_sssnum" name="sssnum">
                              </td>
                              <td>
                                <input class="form-control form-control-sm" type="text" placeholder="PAG-IBIG" v-model="selectedUser.user_pagibignum" name="pagibignum">
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="mt-3">
                                  <label class="form-label">TIN #</label>
                                </div>
                              </td>
                              <td>
                                <div class="mt-3">
                                  <label class="form-label">Philhealth #</label>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input class="form-control form-control-sm" type="text" placeholder="TIN" v-model="selectedUser.user_tin" name="tin">
                              </td>
                              <td>
                                <input class="form-control form-control-sm" type="text" placeholder="Philhealth" v-model="selectedUser.user_philhealthnum" name="philhealthnum">
                              </td>
                            </tr>
                          </table>
                      </div>
                      <div class="modal-footer">
                        <button class="btn btn-primary" type="submit">Save</button>
                        <button class="btn btn-light" type="button" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" data-bs-dismiss="modal">Close</button>
                      </div> 
                    </div>
                  </div>
                </div>
              </form>

              
            </div>
        </div>
        <!-- <font-awesome-icon :icon="['fa', 'hourglass-end']" class="me-2 text-secondary" /> -->
    </div>
    <ToastComponent />
</template>

<script src="../components/js/users.script.js"></script>