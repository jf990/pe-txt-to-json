# pe-txt-to-json

Convert Esri Projection Engine text files to minified JSON format using node.js.

This initial version is a bit inflexible. Here's how it works:

* Receive 4 TXT files from the Esri PE Team:
  * Geographic Transforms
  * Geographic Coordinate Systems
  * Vertical Transforms
  * Vertical Coordinate Systems

* Put those TXT files in the data folder.
* Rename those files to the 4 file names used by this conversion process:
  * gcs_wkt_areas.txt
  * gt_wkt_areas.txt
  * vcs_wkt_areas.txt
  * vt_wkt_areas.txt

* Only if required (because something changed), open `index.js` and update the `fileList` array with:
  * file name
  * file description
  * column order of the tab delimited columns and the matching JSON key name to use to represent that column. Note the code relies on these specific column names so if they change the code consuming this data will also have to change to match.

* Be sure to run `npm install`

* To run the conversion, `npm run process`

The converted files are placed in the `data` folder with the same file name and a `.min.json` extension.
