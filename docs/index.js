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

// locate DOM element representing register
function reg(r) {
    switch (r & 0x3) {
        case 0x1: return $reg_x;
        case 0x2: return $reg_y;
        case 0x3: return $reg_z;
        default: return $reg_t;
    }
}

// execute the instruction @ip
function single_step() {
    const ip = hex2num($reg_ip.value);
    const instr = hex2num(mem(ip).value);
    alert("execute instruction @" + num2hex(ip) + " → " + num2hex(instr));
    $reg_ip.value = num2hex(ip + 1);  // increment ip
    let r = (instr & 0x0C) >> 2;
    let s = (instr & 0x03);
    switch (instr & 0xF0) {
        case 0x00: {  // cp
        }
        case 0x10: {  // nor
        }
        case 0x20: {  // sub
        }
        case 0x30: {  // rol, lsl, lsr, asr
        }
        case 0x40: {  // ld
        }
        case 0x50: {  // st
        }
        case 0x60: {  // jnz
        }
        case 0x70: {  // jsr
        }
        default: {  // lo, hi
            r = (instr & 0x30) >> 8;
            const d = (instr & 0x0F);
            const el = reg(r);
            if (instr & 0xC0 === 0x80) {  // lo
                el.value = num2hex((hex2num(el.value) & 0xF0) | d);
            } else {  // hi
                el.value = num2hex((hex2num(el.value) & 0x0F) | (d << 4));
            }
        }
    }
}
$single_step.onclick = single_step;
