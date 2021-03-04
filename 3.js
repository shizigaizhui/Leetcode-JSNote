const lengthOfLongestSubstring = function(s) {

    const sLen = s.length;
    let setWin = new Set();
    let maxLen = 0,  right = 0, left = 0;
    while( left < sLen &&  right < sLen ){

        if( left != 0 ){
            setWin.delete( s[left-1] );
        }
        

        let thisLen = setWin.size;  // setWin的大小作为初始值，避免了left===0和以后的窗口滑动的歧义
        while( right  < sLen && !setWin.has(s[right]) ){
            thisLen ++;
            setWin.add( s[right] );
            right++;
        }

        maxLen = Math.max( thisLen, maxLen );

        left++;
    }

    return maxLen;
};

