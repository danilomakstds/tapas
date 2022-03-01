<template>
    <div class="text-start" id="body-pd">
    <Header />
    <SideNav />
        <br/>
        <div class="timeedit-request">
            <div class="card-body mb-3">




            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="timeedit-tab" @click="selectTab" data-bs-toggle="tab" data-bs-target="#timeedit" type="button" role="tab" aria-controls="timeedit" aria-selected="true">
                    Time Edit Request</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="leave-tab" @click="selectTab" data-bs-toggle="tab" data-bs-target="#leave" type="button" role="tab" aria-controls="leave" aria-selected="false">
                    Leave Request</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="overtime-tab" @click="selectTab" data-bs-toggle="tab" data-bs-target="#overtime" type="button" role="tab" aria-controls="overtime" aria-selected="false">
                    Overtime Request</button>
                </li>
            </ul>
            <div class="tab-content p-3" id="myTabContent">
                <div class="tab-pane fade show active" id="timeedit" role="tabpanel" aria-labelledby="timeedit-tab">
                  <!-- Time Edit Start-->
                   <button type="button" class="btn btn-primary btn-sm float-end">
                    <font-awesome-icon :icon="['fa', 'plus']" /> Add Time Edit Request
                  </button>
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col" style="width:40px"></th>
                        <th scope="col">Date</th>
                        <th scope="col">Time Modification</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- Time Edit End-->
                </div>
                <div class="tab-pane fade" id="leave" role="tabpanel" aria-labelledby="leave-tab">
                  <!-- leave Start-->
                  <button type="button" class="btn btn-primary btn-sm float-end" @click="showAddLeaveModal">
                    <font-awesome-icon :icon="['fa', 'plus']" /> Add Leave Request
                  </button>
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col" v-if="this.sessionData.user_level > 1"></th>
                          <th scope="col">Date</th>
                          <th scope="col">Hours</th>
                          <th scope="col">Leave Type</th>
                          <th scope="col">Comments</th>
                          <th scope="col">Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="leave in leaveRequestData" :key="leave.id">
                          <td v-if="this.sessionData.user_level > 1">
                            <img :src="leave.avatar" style="height:30px; width:30px" class="rounded-circle me-2" />
                            {{leave.username}}</td>
                          <td>
                            {{leave.date}}
                            <!-- <span class="badge rounded-pill bg-light ms-2 text-dark">{{leave.timestart}}</span> to
                            <span class="badge rounded-pill bg-light text-dark">{{leave.timeend}}</span> -->
                          </td>
                          <td>{{leave.totalhours}}</td>
                          <td>
                            <span class="badge rounded-pill" v-bind:class="{ 'bg-primary': (leave.leave_type == 2), 'bg-warning': (leave.leave_type == 1) }">
                            {{leave.leavetype }}
                            </span>
                          </td>
                          <td>{{leave.comment}}
                          <span v-if="leave.approver_comment" class="fst-italic">
                            <hr />
                            <font-awesome-icon :icon="['fa', 'comment']" /> <b>Admin</b>: {{leave.approver_comment}}
                          </span>
                          </td>
                          <td>
                            <span class="badge rounded-pill"
                            v-bind:class="{ 'bg-secondary': (leave.approval_status == constantsApprovalStatus.PENDING),
                            'bg-success': (leave.approval_status == constantsApprovalStatus.APPROVED),
                            'bg-danger': (leave.approval_status == constantsApprovalStatus.REJECTED) }">
                              {{leave.status}}
                            </span>
                          </td>
                          <td>
                            <button type="button" class="btn btn-primary btn-sm me-2" :disabled="this.sessionData.id != leave.userId ? '' : disabled">
                              <font-awesome-icon :icon="['fa', 'pen']" />
                            </button>
                            <button type="button" class="btn btn-primary btn-sm me-2" :disabled="this.sessionData.id != leave.userId ? '' : disabled">
                              <font-awesome-icon :icon="['fa', 'trash-can']" />
                            </button>
                            <button type="button" class="btn btn-primary btn-sm me-2"
                            :disabled="(this.sessionData.user_level < 2 ||
                            (this.sessionData.user_level == 2 && leave.userId == this.sessionData.id))"
                            @click="approveLeave(leave.id)">
                              <font-awesome-icon :icon="['fa', 'check']" />
                            </button>
                            <button type="button" class="btn btn-primary btn-sm me-2"
                            :disabled="(this.sessionData.user_level < 2 ||
                            (this.sessionData.user_level == 2 && leave.userId == this.sessionData.id))"
                            @click="openRejectLeaveModal(leave)">
                              <font-awesome-icon :icon="['fa', 'ban']" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  <!-- leave End-->
                </div>
                <div class="tab-pane fade" id="overtime" role="tabpanel" aria-labelledby="overtime-tab">
                  <!-- overtime Start-->
                  <button type="button" class="btn btn-primary btn-sm float-end" @click="showOTModal">
                    <font-awesome-icon :icon="['fa', 'plus']" /> Add OT Request
                  </button>
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col" style="width:40px"></th>
                          <th scope="col">Date</th>
                          <th scope="col">Hours</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  <!-- overtime End-->
                </div>
            </div>
            <br/> 
            </div>
        </div>




        <!-- Add Leave Request Modal -->
        <form @submit="addLeaveRequest">
          <div class="modal fade leave-request" id="addleaveModal">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalToggleLabel2">Add Leave Request</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="font-size:12px">
                  <label class="form-label">Remaining <b>VL</b> hours </label>
                  <span class="badge bg-primary ms-2 me-2" style="font-size: 13px">120 hours</span>
                   <label class="form-label">Remaining <b>SL</b> hours </label>
                  <span class="badge bg-warning ms-2" style="font-size: 13px">120 hours</span>
                  <br/><br/>
                  <label class="form-label">Select Leave Type</label>
                  <select class="form-select form-select-md mt-2" v-model="leaveKey" name="leavetype">
                    <option value="1">Sick Leave</option>
                    <option value="2">Vacation Leave</option>
                  </select>
                  <table class="w-100 mt-2" v-if="leaveKey">
                    <tr>
                      <td>
                        <label class="form-label">Date</label>
                        <input class="form-control form-control-md" type="date" v-model="leaveReqDate" name="leavedatestart">
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="form-check mt-3" style="font-size:13px">
                          <input class="form-check-input" type="checkbox" id="flexCheckDefault" v-model="isFullDay">
                          <label class="form-check-label ms-2 mt-1" for="flexCheckDefault" >
                            Is full day
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="!isFullDay">
                      <td>
                         <label class="form-label">Leave hours</label>
                         <input class="form-control form-control-md" type="number" placeholder="" min="4" max="8" required v-model="leaveHours" name="leavehours">
                      </td>
                    </tr>
                    <div class="mb-3 mt-2">
                      <label for="exampleFormControlTextarea1" class="form-label" style="font-size:13px">Comments</label>
                      <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Add leave comments here" v-model="leaveComments" name="leavecomments"></textarea>
                    </div>
                  </table>
                  <br/>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-primary" type="submit">Save</button>
                  <button class="btn btn-light" type="button" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" data-bs-dismiss="modal">Close</button>
                </div> 
              </div>
            </div>
          </div>
        </form>
          <!-- Add Leave Request Modal END -->



          <!-- Add OT Request Modal -->
        <form @submit="addOTRequest">
          <div class="modal fade ot-request" id="addOTModal">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalToggleLabel2">Add Overtime Request</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="font-size:12px">
                  
                </div>
                <div class="modal-footer">
                  <button class="btn btn-primary" type="submit">Save</button>
                  <button class="btn btn-light" type="button" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" data-bs-dismiss="modal">Close</button>
                </div> 
              </div>
            </div>
          </div>
        </form>
          <!-- Add OT Request Modal END -->


        <!--Reject Leave Request Modal -->
        <form @submit="rejectLeave">
          <div class="modal fade rejectleave-request" id="rejectLeaveModal" >
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalToggleLabel2">Add Leave Comments</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="font-size:12px">
                  <div class="mb-3">
                    <label for="exampleFormControlTextarea1" class="form-label">Add Comments</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="selectedLeaveDetails.approver_comment"></textarea>
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-danger" type="submit">Save and Reject</button>
                  <button class="btn btn-light" type="button" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" data-bs-dismiss="modal">Close</button>
                </div> 
              </div>
            </div>
          </div>
        </form>
          <!--Reject Leave Request Modal END -->

    
    </div>
    <ToastComponent />
</template>

<script src="../components/js/request.script.js"></script>

<style scoped>
.leave-request, .timeedit-request, .ot-request, .badge {
    font-size: 13px !important;
}

tbody {
    border-top: none !important;
}

.active {
    color: #333 !important;
}

.nav {
    flex-direction:unset !important;
    justify-content: unset !important;
    overflow: unset;
}

.nav-tabs .nav-link {
  margin-bottom: -1px !important;
}

.form-check-input {
  height: 1.5em;
  width: 1.5em;
}
</style>