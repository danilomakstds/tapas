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
                    <li class="nav-item" role="presentation" v-if="sessionData.user_level > 1">
                    <button class="nav-link" id="generate-tab" @click="selectTab" data-bs-toggle="tab" data-bs-target="#generate" type="button" role="tab" aria-controls="generate" aria-selected="false">
                        Generate Payslips</button>
                    </li>
                </ul>
                <div class="tab-content p-3" id="myTabContent">
                    <div class="tab-pane fade show active" id="mypayslips" role="tabpanel" aria-labelledby="mypayslips-tab">

                    </div>
                    <div class="tab-pane fade" id="generate" role="tabpanel" aria-labelledby="generate-tab" v-if="sessionData.user_level > 1">
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-secondary btn-sm">View Logs</button>
                            <button type="button" class="btn btn-primary btn-sm ms-2">Generate Payslips</button>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-4">
                                <div class="row">
                                    <div class="col-md-8 mt-2">
                                        <table class="table table-hover">
                                            <tbody>
                                                <tr v-for="user in employees" :key="user.id">
                                                    <td v-if="user.user_level < 3">
                                                        <div class="form-check">
                                                            <input class="form-check-input me-3" type="checkbox" :value="user.id" :id="user.id+user.user_email" :checked="user.checked">
                                                            <label class="form-check-label" :for="user.id+user.user_email">
                                                                <img :src="user.user_avatar" style="height:30px; width:30px" class="rounded-circle me-2" />
                                                                {{user.fullname}}
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td v-if="user.user_level < 3">
                                                        <button type="button" class="btn btn-primary btn-sm" @click="viewPayslip(user)" :="!payperiodStart || !payperiodEnd">
                                                        <font-awesome-icon :icon="['fa-solid', 'eye']"/></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="col-md-4 mt-2">
                                        <div class="d-flex justify-content-start">
                                            <div class="form-check me-2">
                                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="15" v-model="selectedPeriod">
                                                <label class="form-check-label" for="flexRadioDefault1">
                                                    15th
                                                </label>
                                            </div>
                                            <div class="form-check me-2">
                                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="30" v-model="selectedPeriod">
                                                <label class="form-check-label" for="flexRadioDefault2">
                                                    30th
                                                </label>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div class="mb-3">
                                            <label for="payroll-start" class="form-label">Pay Period Start</label>
                                            <input type="date" class="form-control" id="payroll-start" v-model="payperiodStart">
                                        </div>
                                        <div class="mb-3">
                                            <label for="payroll-start" class="form-label">Pay Period End</label>
                                            <input type="date" class="form-control" id="payroll-start" v-model="payperiodEnd">
                                        </div>

                                        <div id="decution-adjustments" v-if="isUserSelected">
                                            <hr/>
                                            <span>Adjustments</span>
                                            <div class="form-check mt-3 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="13month" v-model="is13thMonthSelected">
                                                <label class="form-check-label" for="13month">
                                                    13TH MONTH
                                                </label>
                                            </div>
                                            <div class="form-check mt-1 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="incentive">
                                                <label class="form-check-label" for="incentive">
                                                    INCENTIVE
                                                </label>
                                            </div>
                                            <div class="form-check mt-1 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="paid-leaves" checked>
                                                <label class="form-check-label" for="paid-leaves">
                                                    PAID LEAVES
                                                </label>
                                            </div>
                                            <div class="form-check mt-1 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="holiday-pay" checked>
                                                <label class="form-check-label" for="holiday-pay">
                                                    HOLIDAY PAY
                                                </label>
                                            </div>
                                            <div class="form-check mt-1 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="adjustmentothers" :checked="selectedPeriod == userDetails.otherAdjustments" >
                                                <label class="form-check-label" for="adjustmentothers">
                                                    OTHERS (2k)
                                                </label>
                                            </div>


                                            <hr/>
                                            <span>Deductions</span>
                                            <div class="form-check mt-3 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="tax" :checked="selectedPeriod == userDetails.taxDeduction" >
                                                <label class="form-check-label" for="tax">
                                                    W/H TAX
                                                </label>
                                            </div>
                                            <div class="form-check mt-1 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="sss" :checked="selectedPeriod == userDetails.sssDeduction" >
                                                <label class="form-check-label" for="sss">
                                                    SSS
                                                </label>
                                            </div>
                                            <div class="form-check mt-1 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="philhealth" :checked="selectedPeriod == userDetails.philhealthDeduction" >
                                                <label class="form-check-label" for="philhealth">
                                                    PHILHEALTH
                                                </label>
                                            </div>
                                            <div class="form-check mt-1 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="pagibig" :checked="selectedPeriod == userDetails.pagibigDeduction" >
                                                <label class="form-check-label" for="pagibig">
                                                    PAG-IBIG
                                                </label>
                                            </div>
                                            <!-- <div class="form-check mt-1 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="tardiness" checked>
                                                <label class="form-check-label" for="tardiness">
                                                    TARDINESS 
                                                </label>
                                            </div> -->
                                            <div class="form-check mt-1 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="LOAN" :checked="selectedPeriod == userDetails.loanDeduction" >
                                                <label class="form-check-label" for="LOAN">
                                                    LOAN 
                                                </label>
                                            </div>
                                            <div class="form-check mt-1 ms-2">
                                                <input class="form-check-input" type="checkbox" value="" id="deductionothers">
                                                <label class="form-check-label" for="deductionothers">
                                                    OTHERS 
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-8 bg-light">
                                <div class="overflow-hidden pe-3">
                                <button type="button" class="btn btn-success mt-2 btn-sm float-end " @click="printPayslip">
                                <font-awesome-icon :icon="['fa-solid', 'print']" class="me-2"/>
                                Print</button>
                                </div>

                                <div class="row m-1 mt-2" v-if="userDetails">
                                    <div class="col-md-6">
                                        <div class="card mb-4">
                                            <div class="card-header">
                                                Working Hours
                                            </div>
                                            <div class="card-body">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Date</th>
                                                            <th scope="col">Time In/Out</th>
                                                            <th scope="col">Total hours</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="timeinout in userDetails.timeinOut" :key="timeinout.date">
                                                            <td>{{timeinout.date}}</td>
                                                            <td>{{timeinout.timein}} - {{timeinout.timeout}}</td>
                                                            <td>{{timeinout.hours}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <span class="float-end" v-if="userDetails.totalHoursWorked">WORKING HOURS : <strong>{{userDetails.totalHoursWorked}} hours</strong></span>
                                            </div>
                                        </div>

                                        <div class="card">
                                            <div class="card-header">
                                                Holiday Pay
                                            </div>
                                            <div class="card-body">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Date</th>
                                                            <th scope="col">Holiday</th>
                                                            <th scope="col">Total hours</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="hol in userDetails.holidays" :key="hol.date">
                                                            <td>{{hol.date}}</td>
                                                            <td>{{hol.name}}</td>
                                                            <td>{{hol.hours}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <span class="float-end" v-if="userDetails.regularHilidayHours">REGULAR HOLIDAY HOURS : <strong>{{userDetails.regularHilidayHours}} hours</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card mb-4">
                                            <div class="card-header">
                                                Paid Leaves
                                            </div>
                                            <div class="card-body">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Date</th>
                                                            <th scope="col">About</th>
                                                            <th scope="col">Total hours</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="leave in userDetails.leaves" :key="leave.date">
                                                            <td>{{leave.date}}</td>
                                                            <td>{{leave.name}}</td>
                                                            <td>{{leave.hours}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div class="card mb-4">
                                            <div class="card-header">
                                                Deductions
                                            </div>
                                            <div class="card-body">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>W/H TAX</td>
                                                            <td>{{(userDetails.taxDeduction == selectedPeriod) ? userDetails.amountTaxDeduction : '0'}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>SSS</td>
                                                            <td>{{(userDetails.sssDeduction == selectedPeriod) ? userDetails.amountSSSDeduction : '0'}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PAG-IBIG</td>
                                                            <td>{{(userDetails.pagibigDeduction == selectedPeriod) ? userDetails.amountPagibigDeduction : '0'}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PAG-IBIG MP2</td>
                                                            <td>{{(userDetails.pagibigDeduction == selectedPeriod) ? userDetails.amountPagibigMp2Deduction : '0'}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>PHILHEALTH</td>
                                                            <td>{{(userDetails.philhealthDeduction == selectedPeriod) ? userDetails.amountPhilhealthDeduction : '0'}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>LOANS</td>
                                                            <td>{{(userDetails.loanDeduction == selectedPeriod) ? userDetails.amountLoanDeduction : '0'}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>OTHERS</td>
                                                            <td>0</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div class="card mb-4">
                                            <div class="card-header">
                                                Overtime Hours
                                            </div>
                                            <div class="card-body">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Date</th>
                                                            <th scope="col">Total Minutes</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="ots in userDetails.ots" :key="ots.date">
                                                            <td>{{ots.date}}</td>
                                                            <td>{{ots.minutes}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <span class="float-end" v-if="userDetails.totalOTHours">TOTAL OVERTIME HOURS : <strong>{{Math.round(userDetails.totalOTHours * 100) / 100}} hours</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="payslip-viewer p-3" v-if="userDetails">
                                    <table class="w-100 mt-2 bg-white" style="font-size:15px" id="payslip-table">
                                        <tr> 
                                            <td colspan="7">
                                                <h3 class="mb-0">MAKS Datatech Virtual Assistance Services</h3>
                                                <p>Unit 8, Elle Homes Purok Mangga Talay, Dumaguete City, Negros Oriental</p>
                                                <div>
                                                    <h6 class="float-end">
                                                        PERIOD : <strong>{{payperiodStart}}</strong> to <strong>{{payperiodEnd}}</strong>
                                                    </h6>
                                                    <h5><strong>PAYSLIP - SEMI-MONTHLY PAYROLL</strong></h5>
                                                </div>
                                            </td>
                                            <td colspan="2">
                                                <div class="d-flex justify-content-center">
                                                    <img src="../assets/images/makslogo.jpeg" style="height:100px;"/>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr> 
                                            <td colspan="7"></td>
                                            <td colspan="2">
                                                BASIC PAY : {{(userDetails.ratePerHour * userDetails.totalHoursWorked) +
                                                (userDetails.regularHilidayHours * userDetails.ratePerHour) +
                                                (userDetails.totalLeaveHours * userDetails.ratePerHour)}}
                                            </td>
                                        </tr>
                                        <tr> 
                                            <td colspan="3"> EMPLOYEE : <strong>{{userDetails.fullname}}</strong></td>
                                            <td colspan="4"> POSITION : <strong>{{userDetails.user_jobdescription}}</strong></td>
                                            <td colspan="2">
                                                OVERTIME  : {{(Math.round(userDetails.totalOTHours * 100) / 100) * (userDetails.ratePerHour * .3 + userDetails.ratePerHour)}}
                                            </td>
                                        </tr>
                                        <tr> 
                                            <td colspan="3"> STATUS : <strong>REGULAR</strong></td>
                                            <td colspan="4"> WORKING HOURS : <strong>{{this.userDetails.totalHoursWorked}}</strong> </td>
                                            <td colspan="2"></td>
                                        </tr>
                                        <tr> 
                                            <td style="border: 0px"></td>
                                            <td style="border-right: 0px; border-left:0px">HOURS</td>
                                            <td style="border-left: 0px">PAY</td>
                                            <td style="border-right: 0px">ADJUSTMENTS</td>
                                            <td style="border-left: 0px">AMOUNT</td>
                                            <td style="border-right: 0px">ADJUSTMENTS</td>
                                            <td style="border-left: 0px">AMOUNT</td>
                                            <td colspan="2" style="border-bottom:0px">
                                                13th MONTH : {{is13thMonthSelected ? userDetails.user_salary : 0}}
                                            </td>
                                        </tr>
                                        <tr> 
                                            <td>OVERTIME</td>
                                            <td>{{(Math.round(userDetails.totalOTHours * 100) / 100)}}</td>
                                            <td>{{(Math.round(userDetails.totalOTHours * 100) / 100) * (userDetails.ratePerHour * .3 + userDetails.ratePerHour)}}</td>
                                            <td>13TH MONTH</td>
                                            <td>{{is13thMonthSelected ? userDetails.user_salary : 0}}</td>
                                            <td>W/H TAX</td>
                                            <td>{{(userDetails.taxDeduction == selectedPeriod) ? userDetails.amountTaxDeduction : '0'}}</td>
                                            <td colspan="2" style="border-bottom:0px; border-top: 0px">
                                                ALLOWANCE : 0
                                            </td>
                                        </tr>
                                        <tr> 
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>INCENTIVE</td>
                                            <td>0</td>
                                            <td>SSS</td>
                                            <td>{{(userDetails.sssDeduction == selectedPeriod) ? userDetails.amountSSSDeduction : '0'}}</td>
                                            <td colspan="2" style="border-bottom:0px; border-top: 0px">
                                                OTHERS : {{(selectedPeriod == userDetails.otherAdjustments) ? 2000 : 0}}
                                            </td>
                                        </tr>
                                        <tr> 
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>PAID LEAVES</td>
                                            <td>{{userDetails.totalLeaveHours * userDetails.ratePerHour}}</td>
                                            <td>PHILHEALTH</td>
                                            <td>{{(userDetails.philhealthDeduction == selectedPeriod) ? userDetails.amountPhilhealthDeduction : '0'}}</td>
                                            <td colspan="2" style="border-bottom:0px; border-top: 0px">
                                                GROSS PAY : 
                                                {{(userDetails.ratePerHour * userDetails.totalHoursWorked) +
                                                (userDetails.regularHilidayHours * userDetails.ratePerHour) +
                                                (userDetails.totalLeaveHours * userDetails.ratePerHour) +
                                                // Overtime pay
                                                (Math.round(userDetails.totalOTHours * 100) / 100) * (userDetails.ratePerHour * .3 + userDetails.ratePerHour)
                                                }}
                                            </td>
                                        </tr>
                                        <tr> 
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>HOLIDAY PAY</td>
                                            <td>{{userDetails.regularHilidayHours * userDetails.ratePerHour}}</td>
                                            <td>PAG-IBIG</td>
                                            <td>{{(userDetails.pagibigDeduction == selectedPeriod) ? parseFloat(userDetails.amountPagibigDeduction) + parseFloat(userDetails.amountPagibigMp2Deduction) : '0'}}</td>
                                            <td colspan="2" style="border-bottom:0px; border-top: 0px">
                                                DEDUCTION : 
                                                {{
                                                    parseFloat(userDetails.amountPhilhealthDeduction) +
                                                    parseFloat(userDetails.amountSSSDeduction) +
                                                    parseFloat(userDetails.amountTaxDeduction) + 
                                                    parseFloat(userDetails.amountPagibigDeduction) +
                                                    parseFloat(userDetails.amountPagibigMp2Deduction)
                                                }}
                                            </td>
                                        </tr>
                                        <tr> 
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>OTHERS ADJUSTMENTS</td>
                                            <td>{{(selectedPeriod == userDetails.otherAdjustments) ? 2000 : 0}}</td>
                                            <td>LOAN</td>
                                            <td>{{(userDetails.loanDeduction == selectedPeriod) ? userDetails.amountLoanDeduction : '0'}}</td>
                                            <td colspan="2">
                                                <strong>NET PAY</strong> : <strong>₱
                                                {{
                                                ((userDetails.ratePerHour * userDetails.totalHoursWorked) +
                                                (userDetails.regularHilidayHours * userDetails.ratePerHour) +
                                                (userDetails.totalLeaveHours * userDetails.ratePerHour) +
                                                (Math.round(userDetails.totalOTHours * 100) / 100) * (userDetails.ratePerHour * .3 + userDetails.ratePerHour) +
                                                ((selectedPeriod == userDetails.otherAdjustments) ? 2000 : 0) +
                                                (is13thMonthSelected ? parseFloat(userDetails.user_salary) : 0)) -
                                                //Dedcutions
                                                (parseFloat(userDetails.amountPhilhealthDeduction) +
                                                parseFloat(userDetails.amountSSSDeduction) +
                                                parseFloat(userDetails.amountTaxDeduction) + 
                                                parseFloat(userDetails.amountPagibigDeduction) +
                                                parseFloat(userDetails.amountPagibigMp2Deduction))
                                                }}
                                                </strong>
                                            </td>
                                        </tr>
                                        <tr> 
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>OTHERS DEDUCTIONS</td>
                                            <td>0</td>
                                            <td colspan="2" style="border-bottom: 0px"></td>
                                        </tr>
                                        <tr> 
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td colspan="2" style="border-bottom:0px; border-top: 0px">
                                                  RECEIVED BY:<br/><span class="text-uppercase fw-bold text-decoration-underline">{{userDetails.fullname}}</span>
                                            </td>
                                        </tr>
                                        <tr> 
                                            <td colspan="9"></td>
                                        </tr>
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

<script src="../components/js/payslips.script.js"></script>

<style scoped>
#payslip-table {
    border: 1px solid #ccc;
}

#payslip-table tr td{
    border: 1px solid #ccc;
    padding: 10px;
}

.payslip{
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
</style>