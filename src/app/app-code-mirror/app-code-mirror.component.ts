import { Component, OnInit, ViewChild } from '@angular/core';
import 'codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/artis/artis';

@Component({
  selector: 'app-code-mirror',
  templateUrl: `./app-code-mirror.component.html`,
  styleUrls: ['./app-code-mirror.component.css']
})
export class AppCodeMirrorComponent implements OnInit {
  @ViewChild('editor') editor;
  config = {};
  constructor() { this.config = {
                    lineWrapping : true,
                    lineNumbers: true,
                    mode: 'artis',
                    theme: 'twilight',
                    autofocus: true
                  };
                }

  ngOnInit() {
  }
}
