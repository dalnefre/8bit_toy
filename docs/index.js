// 8bit_toy

/*jslint browser, bitwise, long */

const $reg_ip = document.getElementById("reg_ip");
const $reg_t = document.getElementById("reg_t");
const $reg_x = document.getElementById("reg_x");
const $reg_y = document.getElementById("reg_y");
const $reg_z = document.getElementById("reg_z");

const $single_step = document.getElementById("single_step");
const $asm_btn = document.getElementById("asm_btn");
const $assembly = document.getElementById("assembly");

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

const asm_re = /^(\w\w:\w\w\s)?\s*(\w+)\s+([txyz])(,\s*(\w))?\s*$/u;
const reg_id = {"t":0, "x":1, "y":2, "z":3};
const op_id = {
    "cp": 0x00,
    "nor": 0x10,
    "sub": 0x20,
    "rol": 0x30,
    "lsl": 0x31,
    "lsr": 0x32,
    "asr": 0x33,
    "ld": 0x40,
    "st": 0x50,
    "jnz": 0x60,
    "jsr": 0x70,
    "lo": 0x80,
    "hi": 0xC0
}

// assemble one instruction, returning an 8-bit number
function assemble(line) {
    const result = asm_re.exec(line);
    if (result) {
        const op = result[2];
        const r = reg_id[result[3]] ?? 0;
        const d = result[5];
        const s = reg_id[d] ?? 0;
        if ((op === "cp") || (op === "nor") || (op === "sub")) {
            return op_id[op] | (r << 2) | s;
        } else if ((op === "rol") || (op === "lsl") || (op === "lsr") || (op === "asr")) {
            return op_id[op] | (r << 2);
        } else if ((op === "ld") || (op === "st") || (op === "jnz") || (op === "jsr")) {
            return op_id[op] | (r << 2) | s;
        } else if ((op === "lo") || (op === "hi")) {
            return op_id[op] | (r << 4) | (hex2num(d) & 0xF);
        }
    }
}

const id_reg = ["t", "x", "y", "z"];
const id_op = ["cp", "nor", "sub", "sr", "ld", "st", "jnz", "jsr"];
const id_sr = ["rol", "lsl", "lsr", "asr"];

// disassemble one instruction, returning a string
function disassemble(instr) {
    if (instr & 0x80) {
        const r = (instr & 0x30) >> 2;
        const d = (instr & 0x0F);
        const op = (instr & 0x40) ? "hi" : "lo";
        return op + " " + id_reg[r] + "," + num2hex(d)[1];
    } else if ((instr & 0xF0) === 0x30) {
        const r = (instr & 0x0C) >> 2;
        const op = id_sr[instr & 0x03];
        return op + " " + id_reg[r];
    } else {
        const r = (instr & 0x0C) >> 2;
        const s = (instr & 0x03);
        const op = id_op[(instr & 0x70) >> 4];
        return op + " " + id_reg[r] + "," + id_reg[s];
    }
}

// compile assembly script, returning normalized script
function compile(script) {
    let a = 0;
    function xform(line) {
        if (line.length > 0) {
            const instr = assemble(line);
            const b = num2hex(instr);
            mem(a).value = b;
            line = num2hex(a) + ':' + b + " " + disassemble(instr);
            a = (a + 1) & 0xFF;
        }
        return line;
    }
    return script.split("\n").map(xform).join("\n");
}
$asm_btn.onclick = function (evt) {
    const script = compile($assembly.value);
    $assembly.value = script;
}
