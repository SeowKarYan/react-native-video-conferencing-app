export function calculateVote(answer, option1, option2){
    var total = 0;
    var percentageOfOption1 = 0;
    var percentageOfOption2 = 0;
    var numberOfOption1 = 0;
    var numberOfOption2 = 0;
    var result = [];

    total += 1;
    if (answer == option1) {
      numberOfOption1 += 1;
    }
    else {
      numberOfOption2 += 1;
    }
    percentageOfOption1 = (numberOfOption1 / total) * 100;
    percentageOfOption2 = (numberOfOption2 / total) * 100;
    result = [percentageOfOption1,percentageOfOption2];

    return result;
}