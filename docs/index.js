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
    $reg_ip.value = num2hex(ip + 1);  // increment ip
    let r = (instr & 0x0C) >> 2;
    let s = (instr & 0x03);
    switch (instr & 0xF0) {
        case 0x00: {  // cp
            reg(r).value = reg(s).value;
            break;
        }
        case 0x10: {  // nor
            const v = hex2num(reg(r).value);
            const w = hex2num(reg(s).value);
            reg(r).value = num2hex(~(v | w));
            break;
        }
        case 0x20: {  // sub
            const v = hex2num(reg(r).value);
            const w = hex2num(reg(s).value);
            reg(r).value = num2hex(v - w);
            break;
        }
        case 0x30: {  // rol, lsl, lsr, asr
            let v = hex2num(reg(r).value);
            switch (instr & 0x03) {
                case 0x00: {  // rol
                    v = (
                        v & 0x80
                        ? (v << 1) | 1
                        : v << 1
                    );
                    break;
                }
                case 0x01: {  // lsl
                    v = v << 1;
                    break;
                }
                case 0x02: {  // lsr
                    v = v >>> 1;
                    break;
                }
                case 0x03: {  // asr
                    v = (
                        v & 0x80
                        ? (v >>> 1) | 0x80
                        : v >>> 1
                    );
                    break;
                }
            }
            reg(r).value = num2hex(v);
            break;
        }
        case 0x40: {  // ld
            const a = hex2num(reg(s).value);
            reg(r).value = mem(a).value;
            break;
        }
        case 0x50: {  // st
            const a = hex2num(reg(r).value);
            mem(a).value = reg(s).value;
            break;
        }
        case 0x60: {  // jnz
            const b = hex2num(reg(r).value);
            if (b) {
                $reg_ip.value = reg(s).value;  // jump
            }
            break;
        }
        case 0x70: {  // jsr
            reg(r).value = $reg_ip.value;
            $reg_ip.value = reg(s).value;  // jump
            break;
        }
        default: {  // lo, hi
            r = (instr & 0x30) >> 4;
            const d = (instr & 0x0F);
            const el = reg(r);
            if ((instr & 0xC0) === 0x80) {  // lo
                el.value = num2hex((hex2num(el.value) & 0xF0) | d);
            } else {  // hi
                el.value = num2hex((hex2num(el.value) & 0x0F) | (d << 4));
            }
            break;
        }
    }
}
$single_step.onclick = single_step;
