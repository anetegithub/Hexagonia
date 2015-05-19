var ObjectValidator = {
    Validate: function (inT1, sourceT2) {
        if (inT1 != undefined && sourceT2 != undefined) {
            for (var field in sourceT2) {
                if (inT1[field] == undefined)
                    return false;
            }
        } else
            if (inT1 == undefined && sourceT2 == undefined)
                return true;
            else
                return false;
        return true;
    }
};