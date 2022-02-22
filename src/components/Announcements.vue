<template>
  <div class="announcements position-relative">
    <button type="button" class="btn btn-light float-end position-absolute top-0 end-0">
        <font-awesome-icon :icon="['fa', 'plus']" />
    </button>
    <h2 style="font-size: 17px;"><strong>Announcements</strong></h2>
    
    
    <div class="mt-4">
        <div class="alert alert-info" role="alert">
            <strong>Fretzie O. </strong> <br/> Payslips are now available for viewing.
        </div>
        <div class="alert alert-secondary" role="alert">
            <strong>HR Manager</strong> <br/> Secure timesheet entries for yesterday.
        </div>
        <div class="alert alert-success" role="alert">
            <strong>HR Manager</strong> <br/> Naa nay sweldo!.
        </div>

        <!-- <span class="we-rebuild-mobile" style="color: #3a3a3a; letter-spacing: 1.5px;">we rebuild</span><br><span style="color: #3a7ca5;"><span class="animate-mobile fixed1">ecm</span><span class="letter-s-mobile">s</span></span> -->
        <!-- <h1 style="font-size: 100px" id="word">Alpha</h1> -->
    </div>
    
  </div>
</template>

<script src="../components/js/announcements.script.js"></script>
