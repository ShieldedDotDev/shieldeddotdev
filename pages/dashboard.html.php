<!doctype html>
<html>

<head>
	<?php require('_head.php') ?>	
</head>

<body class="dashboard--app">
	<?php require('_header.php') ?>
	<script src="/require.min.js"></script>
	<script src="/main.js"></script>

	<main>
		<section>
			<article id="dashboard">
				<h3>Dashboard</h3>
			</article>
		</section>
	</main>

	<script>
		document.addEventListener('DOMContentLoaded', function () {
			require(['shielded'], function (d) {  
				d.Dashboard( document.getElementById('dashboard') ) 
			});
		});
	</script>
	<?php require('_footer.php') ?>
</body>

</html>