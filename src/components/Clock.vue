<template>
  <div class="clock">
    <div class="time d-flex text-white display-1 fw-normal">

        <!-- Hours -->
        
        <div class="myClock hour" style="background-color: #F95658;text-align: center;">
        <span class="h"></span>
        </div>
        
        <!-- Minutes -->
        <div class="myClock minutes " style="background-color: #2DCB74; text-align: center;">
        <span class="m"></span>
        </div>
        
        <!-- Seconds -->
        <div class="myClock seconds" style="background-color: #377BBC; text-align: center;">
        <span class="s"></span>
        </div>
        
    </div>


    <!-- Date Day and Meridiem -->
    <div class="container dateAndDay text-muted fs-4 d-flex justify-content-center">
        <span class="Day me-2"></span>
        <span class="Date me-2"></span>
        <span class="meridiem"></span>
    </div>

  </div>
</template>

<script src="../components/js/clock.script.js"></script>
