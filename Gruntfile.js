module.exports = function (grunt) {
	

	grunt.initConfig({
	    watch: {
	      jade: {
	        files: ['view/**'],
	        options: {
	          livereload: true
	        }
	      },
	      js: {
	        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
	        // tasks: ['jshint'],
	        options: {
	          livereload: true
	        }
	      },
	      // uglify: {
	      //   files: ['public/**/*.js'],
	      //   tasks: ['jshint'],
	      //   options: {
	      //     livereload: true
	      //   }
	      // },
	      // styles: {
	      //   files: ['public/**/*.less'],
	      //   tasks: ['less'],
	      //   options: {
	      //     nospawn: true
	      //   }
	      // }
	    },

	    // jshint: {
	    //   options: {
	    //     jshintrc: '.jshintrc',
	    //     ignores: ['public/libs/**/*.js']
	    //   },
	    //   all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
	    // },

	    // less: {
	    //   development: {
	    //     options: {
	    //       compress: true,
	    //       yuicompress: true,
	    //       optimization: 2
	    //     },
	    //     files: {
	    //       'public/build/index.css': 'public/less/index.less'
	    //     }
	    //   }
	    // },

	    // uglify: {
	    //   development: {
	    //     files: {
	    //       'public/build/admin.min.js': 'public/js/admin.js',
	    //       'public/build/detail.min.js': [
	    //         'public/js/detail.js'
	    //       ]
	    //     }
	    //   }
	    // },

	    nodemon: {
	      dev: {
	        options: {
	          file: 'app.js',
	          args: [],
	          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
	          watchedExtensions: ['js'],
	          watchedFolders: ['./'],
	          debug: true,
	          delayTime: 1,
	          env: {
	            PORT: 3000
	          },
	          cwd: __dirname
	        }
	      }
	    },

	    
	    mochaTest: {
	      options: {
	        reporter: 'spec'
	      },
	      src: ['test/mocha/**/*.js']
	    },


	    concurrent: {
	      // tasks: ['nodemon', 'watch', 'less', 'uglify', 'jshint'],
	      tasks: ['nodemon', 'watch'],
	      options: {
	        logConcurrentOutput: true
	      }
	    }
  })

	//grunt.loadNpmTasks('grunt-contrib-watch');//监听文件变动
	// grunt.loadNpmTasks('grunt-contrib-sass');//把scss文件编译成css文件
	grunt.loadNpmTasks('grunt-nodemon'); //当入口文件改动时  自动重启
	grunt.loadNpmTasks('grunt-concurrent');//慢任务优化插件，同时跑多个
	grunt.loadNpmTasks('grunt-mocha-test');//测试

	grunt.option('force',true);//防止因其他外在原因终止grunt任务--比如语法错误

	//注册一个默认的任务
	grunt.registerTask('default',['concurrent']);
	//测试任务
	grunt.registerTask('test',['mochaTest']);

}