function loadProjection() {
    {
        let vertexfile = fRead("vertex.txt");
        console.log(vertexfile)
        vertex = {
            "input": {},
            "output": {},
        }
        let vertexgroup = "";
        for (let line of vertexfile.split("\n")) {
            if (line=="") {continue;}
            if (line[0]=="!") {
                vertexgroup = line.substring(1);
            }
            else {
                vertex[vertexgroup][line.split(" ")[0]] = line.split(" ")[1].split(",").map((x)=>{return Number(x)});
            }
        }
        console.log(vertex)
    }
    {
        let polyfile = fRead("poly.txt");
        console.log(polyfile)
        poly = {}
        for (let line of polyfile.split("\n")) {
            if (line=="") {continue;}
            poly[line.split(" ")[0]] = line.split(" ")[1].split(",").map((x)=>{return Number(x)});
        }
        console.log(poly)
    }
    makemapimg();
}
function makemapimg() {
    for (let p of Object.keys(poly)) {
        let intri = poly[p].map((x)=>{return vertex["input"][x]});
        let outtri = poly[p].map((x)=>{return vertex["output"][x]});
        const a = intri[0];
        const ab = VecSubstr(intri[1],intri[0]); // vec
        const ac = VecSubstr(intri[2],intri[0]); // vec
        const A = outtri[0];
        const AB = VecSubstr(outtri[1],outtri[0]); // vec
        const AC = VecSubstr(outtri[2],outtri[0]); // vec
        const M = math.inv([[AB[0],AC[0]],[AB[1],AC[1]]]);
        for (let iy=0;iy<size[1];iy++) {
            for (let ix=0;ix<size[0];ix++) {
                if (include([ix,iy],...outtri)) {
                    Mapping[size[0]*iy+ix] = 110000;
                    const AP = [ix-A[0],iy-A[1]]; // vec
                    const res = math.chain(M).multiply(AP).done()
                    const pos = VecFloor(VecAdd(VecAdd(VecScale(ab,res[0]),VecScale(ac,res[1])),a))
                    const index = [size[0]*iy+ix,pos[0]+pos[1]*size[0]]
                    Mapping[size[0]*iy+ix] = pos[0]+pos[1]*size[0];
                }
            }
        }
    }
}
function VecSubstr(a,b) {
    return [a[0]-b[0],a[1]-b[1]];
}
function VecScale(a,s) {
    return [a[0]*s,a[1]*s];
}
function VecAdd(a,b) {
    return [a[0]+b[0],a[1]+b[1]];
}
function VecFloor(a) {
    return a.map((x)=>{return Math.floor(x)});
}
function include(p,a,b,c){
    ab = VecSubstr(b,a);
    bp = VecSubstr(p,b);
    bc = VecSubstr(c,b);
    cp = VecSubstr(p,c);
    ca = VecSubstr(a,c);
    ap = VecSubstr(p,a);
    c1 = ab[0]*bp[1] - ab[1]*bp[0];
    c2 = bc[0]*cp[1] - bc[1]*cp[0];
    c3 = ca[0]*ap[1] - ca[1]*ap[0];
    return (c1 >= 0 & c2 >= 0 & c3 >= 0)|(c1 <= 0 & c2 <= 0 & c3 <= 0);
}

window.addEventListener("load",loadProjection);