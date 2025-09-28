# 8bit_toy

Learning simulator for a toy 8-bit CPU

## Overview

  * 8-bit data
  * 8-bit addresses
  * 8-bit instructions
  * 4 registers (`00`= t, `01`= x, `10`= y, `11`= z )

## Opcodes

`00xx_rrss` (xx = opcode, rr = target register, ss = source register)

Machine Code | Assembly Code | Description
-------------|---------------|------------
`0000_rrss`  | cp _r_,_s_    | copy register _s_ to register _r_ `(s → r)`
`0001_rrss`  | nor _r_,_s_   | bitwise not-or register _s_ to register _r_ `(~(r \| s) → r)`
`0010_rrss`  | sub _r_,_s_   | subtract register _s_ from register _r_ `(r - s → r)`

`0011_rrxx` (rr = target register, xx = opcode)

Machine Code | Assembly Code | Description
-------------|---------------|------------
`0011_rr00`  | rol _r_       | rotate left register _r_ `({r[6:0],r[7]} → r)`
`0011_rr01`  | lsl _r_       | logical shift left register _r_ `({r[6:0],0} → r)`
`0011_rr10`  | lsr _r_       | logical shift right register _r_ `({0,r[7:1]} → r)`
`0011_rr11`  | asr _r_       | arithmetic shift right register _r_ `({r[7],r[7:1]} → r)`

`01xx_rrss` (xxx = opcode, rr = target register, ss = source register)

Machine Code | Assembly Code | Description
-------------|---------------|------------
`0100_rrss`  | ld _r_,_s_    | load memory from address in register _s_ into register _r_ `(@s → r)`
`0101_rrss`  | st _r_,_s_    | store register _s_ into memory at address in register _r_ `(s → @r)`
`0110_rrss`  | jnz _r_,_s_   | if register _r_ is not zero, jump to address in register _s_
`0111_rrss`  | jsr _r_,_s_   | jump to address in register _s_, saving return address in register _r_

`1xrr_dddd` (x = opcode, rr = target register, dddd = literal data)

Machine Code | Assembly Code | Description
-------------|---------------|------------
`10rr_dddd`  | lo _r_,_d_    | set low nybble of register _r_ to _d_
`11rr_dddd`  | hi _r_,_d_    | set high nybble of register _r_ to _d_
