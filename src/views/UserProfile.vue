<template>
    <div class="text-start" id="body-pd">
    <Header />
    <SideNav />

    <div class="row">
        <div class="col-md-3 mb-3">
            <!-- <img class="card-img-top bg-maks" alt="" src="../assets/images/makses.png" style="height: 250px"> -->
            <div class="bg-white" style="height:200px; border-radius: 10px 10px 0 0"></div>
            <div class="card-body pb-5">
                <div class="d-flex justify-content-center mt-4 position-relative">
                    <img :src="sessionData.user_avatar" class="rounded-circle profile-avatar" />
                </div>
                <div class="mt-5">
                    <span class="text-center">
                        <h5><strong>{{userDetails.user_firstname}} {{userDetails.user_middlename}} {{userDetails.user_lastname}} {{userDetails.user_suffix}}</strong></h5>
                        <p class="mb-0">{{userDetails.user_jobdescription}}</p>
                        <p>{{userDetails.user_email}}</p>
                    </span>
                </div>
            </div>
        </div>
        <div class="col-md-9">
            <div class="card-body">
                
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary mb-2"><font-awesome-icon :icon="['fa', 'pen']" class="me-1" /> Edit</button>
                </div>

                <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Personal Information
                            </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <table class="table table-striped table-hover">
                                    <thead>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="fw-bold w-25">Contact</td>
                                            <td>{{userDetails.user_contact_number}}</td>
                                        </tr>
                                        <tr>
                                            <td class="fw-bold">Current Address</td>
                                            <td>{{userDetails.user_current_address}}</td>
                                        </tr>
                                        <tr>
                                            <td class="fw-bold">Date Started</td>
                                            <td>{{userDetails.user_datehired}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingTwo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Employee Benefits Information
                            </button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <table class="table table-striped table-hover">
                                <thead>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="fw-bold w-25">SSS Number</td>
                                        <td>{{userDetails.user_sssnum}}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Pag-ibig Number</td>
                                        <td>{{userDetails.user_pagibignum}}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Philhealth Number</td>
                                        <td>{{userDetails.user_philhealthnum}}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">TIN Number</td>
                                        <td>{{userDetails.user_tin}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script src="../components/js/user-profile.script.js"></script>

