const fs = require('fs')

const main = async () =>{
    const max = 1000000
    let emission = 2048
    let eraEmission
    let total = 0
    const daysPerEra = 244
    let era = [0]
    let supply = [0]
    let totals = [0]
    for (var i = 1; i <= 16; i++) {
        
        const eraEmission_ = (emission*daysPerEra)
        const total_ = total + eraEmission_ 
        
        if (total_ >= max){
            eraEmission = (max - total)
            total = max
        } else {
            eraEmission = eraEmission_
            total = total_
        }
        
        if (emission > 1){
            emission = emission/2
        } else if(emission === 1 && total <= max) {
            emission = 1
        } else {
            emission = 0
        }

        era.push(i)
        supply.push(eraEmission)
        totals.push(total)
    }
    const emissionObject = {
        eras:era,
        supply:supply,
        total:totals
    }
    await fs.writeFileSync('./src/data/emissionArray.json', JSON.stringify(emissionObject, null,4), 'utf8')
    console.log(emissionObject)
}

main()