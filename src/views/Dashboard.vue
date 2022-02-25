<template>
  <div class="dashboard text-start" id="body-pd">

    <Header />
    <SideNav />
    <!--Container Main start-->
    
    <div class="bg-main-div">
      <div class="row mb-3">

        <div class="col-md-9 mt-3">
          <div class="card border-0">
            <div class="card-body card-calendar">
              <Calendar ref="calendar" @update-is-on-duty="updateIsOnDuty"/>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mt-3">
          <div class="card border-0">
            <div class="card-body mb-3 text-center" :class="{onDuty: isOnDuty}">
              <Clock />
              <form>
              <button type="button" class="btn btn-secondary w-100" @click="setTimeIn()" v-if="!isOnDuty">
                CLOCK IN <font-awesome-icon :icon="['fa', 'business-time']" class="ms-2" /></button>
              <button type="button" class="btn btn-secondary w-100" @click="setTimeOut()" v-if="isOnDuty">
                CLOCK OUT <font-awesome-icon :icon="['fa', 'hourglass-end']" class="ms-2" /></button>
              </form>
              <br/>
            </div>

            <div class="card-body mb-3">
              <h2 style="font-size: 17px;"><strong>My Schedule</strong></h2>
              
            </div>

            <div class="card-body">
              <Announcements />
            </div>

          </div>
        </div>
      </div>

    </div>
    <!--Container Main end-->


  </div>
</template>

<script src="../components/js/dashboard.script.js"></script>
