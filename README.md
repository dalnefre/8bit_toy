# 8bit_toy

Learning simulator for a toy 8-bit CPU

## Overview

  * 8-bit data
  * 8-bit address
  * 4 registers (`00`= t, `01`= x, `10`= y, `11`= z )

## Opcodes

`0xrr_dddd` (x = opcode, rr = target register, dddd = literal data)

Machine Code | Assembly Code | Description
-------------|---------------|------------
`00rr_dddd`  | lo _r_,_d_    | set low nybble of register _r_ to _d_
`01rr_dddd`  | hi _r_,_d_    | set high nybble of register _r_ to _d_

`1000_rrxx` (rr = target register, xx = opcode)

Machine Code | Assembly Code | Description
-------------|---------------|------------
`1000_rr00`  | rol _r_       | rotate left register _r_ `{r[6:0],r[7]}`
`1000_rr01`  | lsl _r_       | logical shift left register _r_ `{r[6:0],0}`
`1000_rr10`  | lsr _r_       | logical shift right register _r_ `{0,r[7:1]}`
`1000_rr11`  | asr _r_       | arithmetic shift right register _r_ `{r[7],r[7:1]}`

`1xxx_rrss` (xxx = opcode, rr = target register, ss = source register)

Machine Code | Assembly Code | Description
-------------|---------------|------------
`1001_rrss`  | cp _r_,_s_    | copy register _s_ to register _r_ `(s → r)`
`1010_rrss`  | nor _r_,_s_   | bitwise not-or register _s_ to register _r_ `(~(r \| s) → r)`
`1011_rrss`  | sub _r_,_s_   | subtract register _s_ from register _r_ `(r - s → r)`
`1100_rrss`  | ld _r_,_s_    | load memory from address in register _s_ into register _r_ `(@s → r)`
`1101_rrss`  | st _r_,_s_    | store register _s_ into memory at address in register _r_ `(s → @r)`
`1110_rrss`  | jnz _r_,_s_   | if register _r_ is not zero, jump to address in register _s_
`1111_rrss`  | jsr _r_,_s_   | jump to address in register _s_, saving return address in register _r_
