<template>
  <div class="calendar">
     <FullCalendar :options="calendarOptions" />
  </div>

  <!-- Modal -->
  <form v-if="selectedEvent.extendedProps" @submit="submitTimeInOutRequest">
    <div class="modal fade" id="viewEventModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title me-2" id="exampleModalLabel">{{selectedEvent._def.extendedProps.realTitle}}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <span v-if="selectedEvent.extendedProps.realTitle != 'Time In - Time Out'">
              <span v-if="selectedEvent.extendedProps.eventType == 'leave'">
                <span class="badge me-2" v-bind:style="{backgroundColor: selectedEvent._def.ui.backgroundColor}">{{selectedEvent.extendedProps.eventDay}}</span>
                {{selectedEvent.extendedProps.description}} <span v-if="selectedEvent.extendedProps.username"> | <strong>{{selectedEvent.extendedProps.username}}</strong></span>
              </span>
              <span v-else>
                <div class="alert alert-info" role="alert">
                  {{ selectedEvent._def.extendedProps.type[0] }}  | <b>{{selectedEvent._def.extendedProps.holidayType}}</b>
                </div>
                <span>{{selectedEvent._def.extendedProps.description}}</span>
              </span>
            </span>
            <span v-else>
              <div class="d-flex justify-content-center">
                <span class="badge bg-timeinout me-2">{{selectedEvent.envStart}}</span> →
                <span class="badge bg-timeinout ms-2">{{selectedEvent.envEnd}}</span><br/>
              </div>
            </span>
          </div>
          <div class="modal-footer" v-if="selectedEvent.extendedProps.realTitle == 'Time In - Time Out'">
              <div v-if="selectedEvent.extendedProps.otMinutes" class="w-100">
                <div class="w-100">
                  <input type="range" :max="selectedEvent.extendedProps.otMinutes" class="w-100" v-model="sliderValue">
                </div>
                <div class="w-100 text-end">
                  <label for="exampleInputEmail1">OT minutes <span class="badge badge-pill badge-success bg-success">{{sliderValue}}</span></label>
                  <span class="fst-italic d-block" style="font-size:11px" v-if="isOTCreated">
                    Overtime request already created for this time entry.
                  </span>
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-light btn-sm mt-2 me-2" @click="editTimeInOut"><font-awesome-icon :icon="['fa', 'pen']" /> Create edit request</button>
                <button type="button" class="btn btn-light btn-sm mt-2" @click="addOTRequest(selectedEvent, sliderValue)" v-if="selectedEvent.extendedProps.otMinutes" :disabled="isOTCreated">
                <font-awesome-icon :icon="['fa', 'plus']" /> Add OT request</button>
              </div>
          </div>
          <div class="modal-footer"  v-if="editTimeInOutMode">
            <div v-if="editTimeInOutMode">
              <table>
                <tr>
                  <td>
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">Time In</label>
                      <input type="text" class="form-control" name="timein" id="exampleFormControlInput1" placeholder="00:00" v-model="editTimeIn">
                    </div></td>
                  <td>
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">Time Out</label>
                      <input type="text" class="form-control" name="timeout" id="exampleFormControlInput1" placeholder="00:00" v-model="editTimeOut">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <div class="mb-3">
                      <label for="exampleFormControlTextarea1" class="form-label">Add edit comments</label>
                      <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="timeEditComment" required></textarea>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <button type="submit" class="btn btn-primary btn-sm" v-if="editTimeInOutMode">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </form>


</template>

<script src="./js/calendar.script.js"></script>