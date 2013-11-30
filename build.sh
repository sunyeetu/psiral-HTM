#!/bin/sh
#
# Build game and create distributable
##################################################

PWD=$(pwd)
YUI=$(pwd)/yuicompressor-2.4.8.jar
BUILD=$(pwd)/build
BUILDNUM_FILE=`readlink -f build.number`
BUILDVERSION_FILE=`readlink -f build.version`
BUILD_NAME=

if [ ! -d $BUILD ]; then
    echo "Build folder($BUILD) does not exist!"
    exit
fi

if [ ! -e $YUI ]; then
    echo "YUI not found in $YUI!"
    exit
fi

# any cmd line params?
CMD="$1"
if [ ! -z $CMD ]; then
    if [ $CMD = "clean" ]; then
        CLEANONLY=1
    elif [ $CMD = "no-urchin" ]; then
        NO_URCHIN=1
    elif [ $CMD = "--version" ]; then
        if [ ! -z "$2" ]; then
            BUILD_NAME="$2"
        else 
            echo "Invalid build name!"
            exit
        fi
    else
        echo "Invalid cmd line parameter."
        echo
        echo "Usage: build.sh [clean] [no-urchin] [--version (text)]"
        echo
        exit
    fi
fi

echo "Cleaning ..."

### Cleanup old build files
find $BUILD -type f ! -name ".gitkeep" |xargs -i rm {}
find $BUILD -type d ! -name ".gitkeep" -and ! -name "build" |xargs -i rmdir {} -p --ignore-fail-on-non-empty

if [ ! -z $CLEANONLY ]; then 
    echo "Done."
    exit
fi

echo "Building ..."

### Copy required files
#find . -not -name "/.git*" -and ! -iname "build" -and ! -name "*.jar" -and ! -name "tests*" -and ! -name ".*" | xargs  -i  cp {} $BUILD/{} -R
#find . \( -name '.project*' -o -name '.git*' -o -name '*.sh' -o -name 'build*' -o -name '.settings*' -o -name 'tests.*' -o -name '*.jar'  \) \
#-prune -o -print | xargs echo {}# cp {} $BUILD/{} -R

cp css/ $BUILD -R
cp assets/ $BUILD -R
cp js/ $BUILD -R
# [ -e $BUILD/js/config.js ] && rm $BUILD/js/config.js
cp vendor/ $BUILD -R
[ -e $BUILD/vendor/howler.js ] && rm $BUILD/vendor/howler.js
[ -e $BUILD/vendor/melonJS-0.9.10.js ] && rm $BUILD/vendor/melonJS-0.9.10.js
cp index.html index.php .htaccess LICENSE manifest.webapp favicon.ico $BUILD

### Obfuscate javascript
echo "Minifying ..."
cd $BUILD/css
java -jar $YUI -o 'main.css' main.css
cd $BUILD/js
find *.js -not -name "require.js" -not -name "config*.js" | xargs -i java -jar $YUI -o '.js$:.js' {}
cd $BUILD/js/entities
find *.js | xargs -i java -jar $YUI -o '.js$:.js' {}
cd $BUILD/js/scenes
find *.js | xargs -i java -jar $YUI -o '.js$:.js' {}

# remove debug option
cd $BUILD/js
sed -i 's/isDebug:true/isDebug:false/g' globals.js

### Production
cd $BUILD

if [ -z "$BUILD_NAME" ]; then
    # increment build number
    echo "Setting build number ..."
    if [ -f $BUILDNUM_FILE ]; then
        BUILDNUM=`cat $BUILDNUM_FILE`
    else
        BUILDNUM=1
    fi
    BUILDNUM=$((BUILDNUM + 1))
    echo $BUILDNUM > $BUILDNUM_FILE

    if [ -f $BUILDVERSION_FILE ]; then
        VER=`cat $BUILDVERSION_FILE`
        BUILDNUM="$VER-$BUILDNUM"
    fi
else
    BUILDNUM=$BUILD_NAME
fi

# insert build no. into html
#sed -i 's/<\!\-\-build\-\->/Build: '$BUILDNUM'/g' index.html
sed -i 's/buildnumber:_timestamp/buildnumber:"'"$BUILDNUM"'"/g' index.html

# add urchin
if [ ! -z $NO_URCHIN ]; then 
    echo "Skipped: urchin <script>."
else
    # insert urchin into html
    sed -i '/<\!\-\-URCHIN\-\->/{
        s/<\!\-\-URCHIN\-\->//g
        r ../urchin
    }' index.html
fi

echo "Build completed."