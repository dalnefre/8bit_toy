// 8bit_toy

/*jslint browser, bitwise, long */

const $reg_ip = document.getElementById("reg_ip");
const $reg_t = document.getElementById("reg_t");
const $reg_x = document.getElementById("reg_x");
const $reg_y = document.getElementById("reg_y");
const $reg_z = document.getElementById("reg_z");

const $single_step = document.getElementById("single_step");

// convert number to hexadecimal string
function num2hex(num) {
    return (num & 0xFF).toString(16).toUpperCase().padStart(2, "0");
}

// convert hexadecimal string to number
function hex2num(hex) {
    return parseInt(hex, 16) & 0xFF;
}

// locate DOM element representing memory cell
function mem(addr) {
    const id = "mem" + num2hex(addr);
    return document.getElementById(id);
}

// execute the instruction @ip
function single_step() {
    const ip = hex2num($reg_ip.value);
    const instr = hex2num(mem(ip).value);
    alert("execute instruction @" + num2hex(ip) + " → " + num2hex(instr));
}
$single_step.onclick = single_step;
