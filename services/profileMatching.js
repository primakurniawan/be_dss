function profileMatching(alternatives, aspects) {
  alternatives.forEach((alternative) => {
    alternative.aspects.forEach((alternative_aspect) => {
      aspects.forEach((aspect) => {
        if (alternative_aspect.aspect_id === aspect.aspect_id) {
          alternative_aspect.criteria.forEach((alternative_criteria) => {
            aspect.criteria.forEach((criteria) => {
              if (alternative_criteria.criteria_id === criteria.criteria_id) {
                alternative_criteria.parameter.gap = criteria.parameter.point - alternative_criteria.parameter.point;
                switch (alternative_criteria.parameter.gap) {
                  case 0:
                    alternative_criteria.parameter.weight = 5;
                    break;
                  case 1:
                    alternative_criteria.parameter.weight = 4.5;
                    break;
                  case 2:
                    alternative_criteria.parameter.weight = 3.5;
                    break;
                  case 3:
                    alternative_criteria.parameter.weight = 2.5;
                    break;
                  case 4:
                    alternative_criteria.parameter.weight = 1.5;
                    break;
                  case 5:
                    alternative_criteria.parameter.weight = 0.5;
                    break;
                  case -1:
                    alternative_criteria.parameter.weight = 4;
                    break;
                  case -2:
                    alternative_criteria.parameter.weight = 3;
                    break;
                  case -3:
                    alternative_criteria.parameter.weight = 2;
                    break;
                  case -4:
                    alternative_criteria.parameter.weight = 1;
                    break;
                  default:
                    alternative_criteria.parameter.weight = 0;
                    break;
                }
                alternative_criteria.point = (alternative_criteria.parameter.weight * alternative_criteria.criteria_percentage) / 100;
              }
            });
          });
        }
      });
      // alternative_aspect.point = (alternative_aspect.criteria.reduce((accumulator, currentValue) => accumulator + currentValue.point, 0) * alternative_aspect.aspect_percentage) / 100;
      alternative_aspect.point = 0;
      alternative_aspect.criteria.forEach((criteria) => {
        if (criteria.point !== undefined) {
          alternative_aspect.point += criteria.point * (criteria.criteria_percentage / 100);
        }
      });
      console.log("alternative_aspect.point", alternative_aspect.point);
    });
    alternative.point = 0;
    alternative.aspects.forEach((aspect) => {
      alternative.point += aspect.point * (aspect.aspect_percentage / 100);
    });
  });

  const rank = alternatives
    .sort((a, b) => b.point - a.point)
    .map((e, i) => {
      return {
        ...e,
        rank: i + 1,
      };
    });

  return rank;
}
module.exports = profileMatching;
