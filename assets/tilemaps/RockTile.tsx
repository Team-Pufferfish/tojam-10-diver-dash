<?xml version="1.0" encoding="UTF-8"?>
<tileset name="RockTile" tilewidth="32" tileheight="32">
 <image source="../images/RockTile.png" width="320" height="192"/>
 <terraintypes>
  <terrain name="Rock" tile="31"/>
  <terrain name="Air" tile="0"/>
 </terraintypes>
 <tile id="0" terrain="1,1,1,1"/>
 <tile id="1" terrain="1,1,1,1"/>
 <tile id="2" terrain="1,1,1,1"/>
 <tile id="3" terrain="0,0,0,1"/>
 <tile id="4" terrain="0,0,1,0"/>
 <tile id="5">
  <properties>
   <property name="name" value="gold"/>
   <property name="sprite" value="gold"/>
   <property name="type" value="item"/>
  </properties>
 </tile>
 <tile id="6">
  <properties>
   <property name="type" value="playerStart"/>
  </properties>
 </tile>
 <tile id="13" terrain="0,1,0,0"/>
 <tile id="14" terrain="1,0,0,0"/>
 <tile id="15">
  <properties>
   <property name="sprite" value="seaweed"/>
   <property name="type" value="decoration"/>
  </properties>
 </tile>
 <tile id="30" terrain="1,0,1,0"/>
 <tile id="31" terrain="0,0,0,0"/>
 <tile id="32" terrain="0,0,0,0"/>
 <tile id="33" terrain="0,1,0,1"/>
 <tile id="40" terrain="1,0,1,1"/>
 <tile id="41" terrain="0,0,1,1"/>
 <tile id="42" terrain="0,0,1,1"/>
 <tile id="43" terrain="0,1,1,1"/>
 <tile id="50" terrain="1,1,1,0"/>
 <tile id="51" terrain="1,1,0,0"/>
 <tile id="52" terrain="1,1,0,0"/>
 <tile id="53" terrain="1,1,0,1"/>
</tileset>
