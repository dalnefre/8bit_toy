// 8bit_toy

/*jslint browser, bitwise, long */

const $reg_ip = document.getElementById("reg_ip");
const $reg_t = document.getElementById("reg_t");
const $reg_x = document.getElementById("reg_x");
const $reg_y = document.getElementById("reg_y");
const $reg_z = document.getElementById("reg_z");

const $single_step = document.getElementById("single_step");

function single_step() {
    alert("execute instruction " + $reg_ip.value);
}
$single_step.onclick = single_step;
