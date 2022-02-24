<template>
  <div class="dashboard text-start" id="body-pd">

    <header class="header" id="header">
        <div class="header_toggle"> <font-awesome-icon :icon="['fa', 'bars']" id="header-toggle" /></div>
        <!-- <div class="header_img"> <img src="https://i.imgur.com/hczKIze.jpg" alt=""> </div> -->
        <div class="d-flex flex-row-reverse bd-highlight">
          
          <div class="p-2 bd-highlight ps-3">
            <font-awesome-icon :icon="['fa', 'gear']" class="main-icon animate_infinite"/>
          </div>
          
          <div class="p-2 bd-highlight position-relative ps-3">
            <div class="dropdown dropleft">
              <a role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src="../assets/images/avatar.jpg" class="rounded-circle" style="height:30px;"/>
                <span class="ms-2">{{sessionData.user_firstname}}</span>
                <font-awesome-icon :icon="['fa', 'angle-down']" style="font-size: 10px" class="ms-2"/>
              </a>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item" href="#">
                  <font-awesome-icon :icon="['fa', 'user']" class="me-2"/> Profile</a>
                <a class="dropdown-item" href="#">
                  <font-awesome-icon :icon="['fa', 'wallet']" class="me-2"/> My Wallet</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" @click="logOutUser">
                  <font-awesome-icon :icon="['fa', 'arrow-right-from-bracket']" class="me-2"/> Logout</a>
              </div>
            </div>
          </div>

          <div class="p-2 bd-highlight position-relative ps-3">
            <span class="badge badge-pill badge-danger">9</span>
            <font-awesome-icon :icon="['fa', 'bell']" class="main-icon"/>
          </div>
        </div>
    </header>
    <div class="l-navbar" id="nav-bar">
        <nav class="nav">
           <div>
              <a href="#" class="nav_logo">
                <span class="nav_logo-name">
                  <img src="../assets/images/maks.png" class="me-3" style="height:35px"/> T A P A S
                </span>
              </a>
              <div class="nav_list">
                <a href="#" class="nav_link active">
                  <font-awesome-icon :icon="['fa', 'chart-line']" class="ms-2 nav_icon" />
                  <span class="nav_name">Dashboard</span>
                </a>
                <a href="#" class="nav_link">
                  <font-awesome-icon :icon="['fa', 'money-check-dollar']" class="ms-2 nav_icon" />
                  <span class="nav_name">Payslips</span>
                </a>
                <a href="#" class="nav_link">
                  <font-awesome-icon :icon="['fa-solid', 'mug-hot']" class="ms-2 nav_icon" />
                  <span class="nav_name">&nbsp;Leave</span>
                </a>
                <a href="#" class="nav_link">
                  <font-awesome-icon :icon="['fa-solid', 'clock-four']" class="ms-2 nav_icon" />
                  <span class="nav_name">&nbsp;Overtime</span>
                </a>
                <a href="#" class="nav_link">
                  <font-awesome-icon :icon="['fa-solid', 'cake-candles']" class="ms-2 nav_icon" />
                  <span class="nav_name"> &nbsp;&nbsp;Holidays</span>
                </a>
                <a href="#" class="nav_link">
                  <font-awesome-icon :icon="['fa-solid', 'user-group']" class="ms-2 nav_icon" />
                  <span class="nav_name">Users</span>
                </a>
                <a href="#" class="nav_link">
                  <font-awesome-icon :icon="['fa-solid', 'user-gear']" class="ms-2 nav_icon" />
                  <span class="nav_name">Profile</span>
                </a>
              </div>
            </div> 
            <!-- <a href="#" class="nav_link"> <i class='bx bx-log-out nav_icon'></i> <span class="nav_name">SignOut</span> </a> -->
        </nav>
    </div>
    <!--Container Main start-->
    <br/>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#" class="text-secondary">Maks</a></li>
        <li class="breadcrumb-item"><a href="#" class="text-secondary">TAPAS</a></li>
        <li class="breadcrumb-item text-secondary">Dashboard</li>
      </ol>
    </nav>

    <div class="bg-main-div">
      <div class="row mb-3">

        <div class="col-md-9 mt-3">
          <div class="card border-0">
            <div class="card-body card-calendar">
              <Calendar ref="calendar"/>
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

            <div class="card-body mb-3" v-if="isOnDuty">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Time In</th>
                    <th scope="col"></th>
                    <th scope="col">Time Out</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row"><font-awesome-icon :icon="['fa', 'business-time']" class="me-2 text-secondary" /></th>
                    <td>{{formatDigits(userTimeIn)}}</td>
                    <th scope="row"><font-awesome-icon :icon="['fa', 'hourglass-end']" class="me-2 text-secondary" /></th>
                    <td>{{formatDigits(projectedTimeOut(userTimeIn))}}</td>
                  </tr>
                </tbody>
              </table>
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
