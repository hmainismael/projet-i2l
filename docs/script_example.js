name : Processor;
parameters : {
 processing_time : < R+ > = 10.0;
}
state: {
 phase: { passive, busy };
 sigma: < R+ >;
 q: [(x: < R >; y: < R >;)];
 z: (x: < R >; y: < R >;);
}
in_ports: {
 in: {
   v: (x: < R >; y: < R >;);
 }
}
out_ports: {
 out: {
   v: (x: < R >; y: < R >;);
 }
}
init: {
 phase = passive;
 sigma = +inf;
 q = empty_set;
 z = | 0, 0 |;
}
delta_int: {
 (phase, sigma, [^h|t], z) -> (passive, processing_time, t, z)
}
delta_ext: {
 ((passive, sigma, q, z), e, {in: {v}}) -> (busy, processing_time, q, z)
 ((busy, sigma, q, z), e, {in: {v}}) -> (busy, sigma - e, [^v|q], z)
}
delta_conf: {
}
ta: {
 (phase, sigma, q, z) -> sigma;
}
output: {
 (phase, sigma, [^h|t], z) -> {out: {h}}
}

