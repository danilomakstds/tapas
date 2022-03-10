<template>
    <div class="text-start" id="body-pd">
    <Header />
    <SideNav />
        <br/>
        <div class="payslip">
            <div class="card-body mb-3">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="mypayslips-tab" @click="selectTab" data-bs-toggle="tab" data-bs-target="#mypayslips" type="button" role="tab" aria-controls="mypayslips" aria-selected="true">
                        My Payslips</button>
                    </li>
                    <li class="nav-item" role="presentation">
                    <button class="nav-link" id="generate-tab" @click="selectTab" data-bs-toggle="tab" data-bs-target="#generate" type="button" role="tab" aria-controls="generate" aria-selected="false">
                        Generate Payslips</button>
                    </li>
                </ul>
                <div class="tab-content p-3" id="myTabContent">
                    <div class="tab-pane fade show active" id="mypayslips" role="tabpanel" aria-labelledby="mypayslips-tab">

                    </div>
                    <div class="tab-pane fade" id="generate" role="tabpanel" aria-labelledby="generate-tab">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="../components/js/payslips.script.js"></script>

<style scoped>

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